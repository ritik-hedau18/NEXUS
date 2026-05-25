package com.nexus.summary;

import com.nexus.document.model.Document;
import com.nexus.document.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SummaryService {
    private static final Logger logger = LoggerFactory.getLogger(SummaryService.class);

    private final DocumentRepository documentRepository;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public SummaryService(DocumentRepository documentRepository, VectorStore vectorStore, ChatClient chatClient) {
        this.documentRepository = documentRepository;
        this.vectorStore = vectorStore;
        this.chatClient = chatClient;
    }

    public DocumentSummary generateSummary(UUID docId) {
        Document jpaDoc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with ID: " + docId));

        if (!"READY".equals(jpaDoc.getStatus())) {
            throw new IllegalStateException("Document is not ready for summarization. Current status: " + jpaDoc.getStatus());
        }

        logger.info("Generating summary for document: {} (ID: {})", jpaDoc.getFileName(), docId);

        // 1. Fetch document chunks from Qdrant
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        Filter.Expression filterExpression = b.eq("documentId", docId.toString()).build();

        SearchRequest request = SearchRequest.builder()
                .query(jpaDoc.getFileName()) // Use filename as search query to fetch chunks
                .topK(50)
                .filterExpression(filterExpression)
                .build();

        List<org.springframework.ai.document.Document> chunks = vectorStore.similaritySearch(request);

        if (chunks.isEmpty()) {
            throw new IllegalStateException("No document chunks found in vector store for ID: " + docId);
        }

        // 2. Sort chunks by chunkIndex to assemble original text sequence
        chunks.sort(Comparator.comparingInt(d -> {
            Object idx = d.getMetadata().get("chunkIndex");
            if (idx instanceof Number) {
                return ((Number) idx).intValue();
            }
            return 0;
        }));

        // 3. Concat text chunks
        String fullText = chunks.stream()
                .map(org.springframework.ai.document.Document::getText)
                .collect(Collectors.joining("\n"));

        // 4. Send request to ChatClient to generate structured DocumentSummary record
        String userPrompt = String.format("""
                Please analyze and summarize the following document content.
                Ensure that your response maps exactly to the requested output structure.
                
                Document Filename: %s
                Document Content:
                %s
                """, jpaDoc.getFileName(), fullText);

        try {
            return chatClient.prompt()
                    .user(userPrompt)
                    .call()
                    .entity(DocumentSummary.class);
        } catch (Exception e) {
            logger.error("Failed to generate structured summary: {}", e.getMessage(), e);
            throw new RuntimeException("AI failed to generate document summary: " + e.getMessage());
        }
    }
}
