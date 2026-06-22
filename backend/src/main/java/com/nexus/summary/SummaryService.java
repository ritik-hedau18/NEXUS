package com.nexus.summary;

import com.nexus.document.model.Document;
import com.nexus.document.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SummaryService {
    private static final Logger logger = LoggerFactory.getLogger(SummaryService.class);

    private final DocumentRepository documentRepository;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public SummaryService(DocumentRepository documentRepository, VectorStore vectorStore, ChatClient.Builder chatClientBuilder) {
        this.documentRepository = documentRepository;
        this.vectorStore = vectorStore;
        this.chatClient = chatClientBuilder.build();
    }

    public DocumentSummary generateSummary(UUID docId) {
        Document jpaDoc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with ID: " + docId));

        if (!"READY".equals(jpaDoc.getStatus())) {
            throw new IllegalStateException("Document is not ready for summarization. Current status: " + jpaDoc.getStatus());
        }

        logger.info("Generating summary for document: {} (ID: {})", jpaDoc.getFileName(), docId);

        // 1. Fetch document chunks from vector store
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        Filter.Expression filterExpression = b.eq("documentId", docId.toString()).build();

        SearchRequest request = SearchRequest.builder()
                .query(jpaDoc.getFileName())
                .topK(50)
                .filterExpression(filterExpression)
                .build();

        List<org.springframework.ai.document.Document> chunks = new ArrayList<>(vectorStore.similaritySearch(request));

        // 2. If vector store is empty (e.g. server restarted), re-ingest from persisted bytes
        if (chunks.isEmpty()) {
            logger.warn("Vector store empty for document ID: {}. Attempting re-ingestion from persisted file bytes.", docId);
            chunks = reIngestFromDatabase(jpaDoc, docId);
        }

        if (chunks.isEmpty()) {
            throw new IllegalStateException(
                "No document chunks found. The document may need to be re-uploaded. Document ID: " + docId);
        }

        // 3. Sort chunks by chunkIndex to assemble original text sequence
        chunks.sort(Comparator.comparingInt(d -> {
            Object idx = d.getMetadata().get("chunkIndex");
            if (idx instanceof Number) {
                return ((Number) idx).intValue();
            }
            return 0;
        }));

        // 4. Concat text chunks
        String fullText = chunks.stream()
                .map(org.springframework.ai.document.Document::getText)
                .collect(Collectors.joining("\n"));

        // 5. Build prompt explicitly requesting raw JSON (compatible with Groq/Llama models)
        String userPrompt = String.format("""
                Please analyze and summarize the following document content.
                Return ONLY a valid JSON object with no markdown, no code blocks, no explanation.
                The JSON must have these exact fields:
                {
                  "title": "document title",
                  "summary": "concise executive summary in 2-3 sentences",
                  "keyPoints": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
                  "documentType": "type of document e.g. Guide, Report, Manual",
                  "estimatedReadTime": "X min read"
                }
                
                Document Filename: %s
                Document Content:
                %s
                """, jpaDoc.getFileName(), fullText);

        try {
            String jsonResponse = chatClient.prompt()
                    .user(userPrompt)
                    .call()
                    .content();

            logger.info("Raw AI response: {}", jsonResponse);

            if (jsonResponse == null || jsonResponse.trim().isEmpty()) {
                throw new IllegalStateException("AI returned an empty response");
            }

            String cleanJson = jsonResponse.trim();
            if (cleanJson.startsWith("```")) {
                int firstLineBreak = cleanJson.indexOf('\n');
                if (firstLineBreak != -1) {
                    cleanJson = cleanJson.substring(firstLineBreak).trim();
                }
                if (cleanJson.endsWith("```")) {
                    cleanJson = cleanJson.substring(0, cleanJson.length() - 3).trim();
                }
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(cleanJson, DocumentSummary.class);
        } catch (Exception e) {
            logger.error("Failed to generate structured summary: {}", e.getMessage(), e);
            throw new RuntimeException("AI failed to generate document summary: " + e.getMessage());
        }
    }

    /**
     * Re-ingests document chunks from persisted file bytes in the database.
     * Called when the in-memory SimpleVectorStore is empty after a server restart.
     */
    private List<org.springframework.ai.document.Document> reIngestFromDatabase(Document jpaDoc, UUID docId) {
        byte[] fileBytes = jpaDoc.getFileContent();
        if (fileBytes == null || fileBytes.length == 0) {
            logger.warn("No persisted file bytes found for document ID: {}. Cannot re-ingest.", docId);
            return Collections.emptyList();
        }

        try {
            logger.info("Re-ingesting document from database bytes: {} ({} bytes)", jpaDoc.getFileName(), fileBytes.length);

            Resource resource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return jpaDoc.getFileName();
                }
            };

            TikaDocumentReader reader = new TikaDocumentReader(resource);
            List<org.springframework.ai.document.Document> springAiDocs = reader.read();

            if (springAiDocs.isEmpty()) {
                logger.warn("Tika returned empty content during re-ingestion for document ID: {}", docId);
                return Collections.emptyList();
            }

            TokenTextSplitter splitter = TokenTextSplitter.builder()
                    .withChunkSize(800)
                    .withMinChunkSizeChars(100)
                    .withMinChunkLengthToEmbed(5)
                    .withMaxNumChunks(10000)
                    .withKeepSeparator(true)
                    .build();

            List<org.springframework.ai.document.Document> rawChunks = splitter.apply(springAiDocs);

            List<org.springframework.ai.document.Document> finalizedChunks = new ArrayList<>();
            for (int i = 0; i < rawChunks.size(); i++) {
                org.springframework.ai.document.Document rawChunk = rawChunks.get(i);
                String chunkKey = docId.toString() + "_" + i;
                String chunkId = UUID.nameUUIDFromBytes(chunkKey.getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();

                Map<String, Object> metadata = new HashMap<>(rawChunk.getMetadata());
                metadata.put("workspaceId", jpaDoc.getWorkspace().getId().toString());
                metadata.put("documentId", docId.toString());
                metadata.put("fileName", jpaDoc.getFileName());
                metadata.put("chunkIndex", i);

                finalizedChunks.add(new org.springframework.ai.document.Document(chunkId, rawChunk.getText(), metadata));
            }

            // Write back to vector store so subsequent requests don't need re-ingestion
            vectorStore.write(finalizedChunks);
            logger.info("Re-ingestion complete for document ID: {}. Restored {} chunks to vector store.", docId, finalizedChunks.size());

            return finalizedChunks;

        } catch (Exception e) {
            logger.error("Re-ingestion failed for document ID: {}. Error: {}", docId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
