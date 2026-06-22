package com.nexus.document.service;

import com.nexus.document.repository.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DocumentIngestionService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentIngestionService.class);

    private final DocumentRepository documentRepository;
    private final VectorStore vectorStore;

    public DocumentIngestionService(DocumentRepository documentRepository, VectorStore vectorStore) {
        this.documentRepository = documentRepository;
        this.vectorStore = vectorStore;
    }

    @Async("documentIngestionExecutor")
    public void ingestDocument(com.nexus.document.model.Document jpaDoc, byte[] fileBytes) {
        logger.info("Starting background ingestion for document: {} (ID: {}) in workspace: {}", 
                jpaDoc.getFileName(), jpaDoc.getId(), jpaDoc.getWorkspace().getId());

        try {
            // 1. Create ByteArrayResource from byte array
            Resource resource = new ByteArrayResource(fileBytes) {
                @Override
                public String getFilename() {
                    return jpaDoc.getFileName();
                }
            };

            // 2. Read document using Tika Document Reader
            TikaDocumentReader reader = new TikaDocumentReader(resource);
            List<Document> springAiDocs = reader.read();

            if (springAiDocs.isEmpty()) {
                throw new IllegalStateException("Tika returned empty content for the document.");
            }

            // 3. Split document into chunks
            TokenTextSplitter splitter = TokenTextSplitter.builder()
                    .withChunkSize(800)
                    .withMinChunkSizeChars(100)
                    .withMinChunkLengthToEmbed(5)
                    .withMaxNumChunks(10000)
                    .withKeepSeparator(true)
                    .build();

            List<Document> rawChunks = splitter.apply(springAiDocs);

            // 4. Generate deterministic custom IDs (valid UUIDs) and add metadata
            List<Document> finalizedChunks = new ArrayList<>();
            for (int i = 0; i < rawChunks.size(); i++) {
                Document rawChunk = rawChunks.get(i);
                String chunkKey = jpaDoc.getId().toString() + "_" + i;
                String chunkId = UUID.nameUUIDFromBytes(chunkKey.getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();
                
                Map<String, Object> metadata = new HashMap<>(rawChunk.getMetadata());
                metadata.put("workspaceId", jpaDoc.getWorkspace().getId().toString());
                metadata.put("documentId", jpaDoc.getId().toString());
                metadata.put("fileName", jpaDoc.getFileName());
                metadata.put("chunkIndex", i);

                finalizedChunks.add(new Document(chunkId, rawChunk.getText(), metadata));
            }

            // 5. Write chunks to vector store
            vectorStore.write(finalizedChunks);

            // 6. Update database record (include file bytes for persistence across restarts)
            com.nexus.document.model.Document doc = documentRepository.findById(jpaDoc.getId()).orElse(jpaDoc);
            doc.setStatus("READY");
            doc.setChunkCount(finalizedChunks.size());
            doc.setFileContent(fileBytes); // Persist raw bytes for re-ingestion after server restart
            documentRepository.save(doc);

            logger.info("Successfully ingested document: {}. Generated {} chunks.", jpaDoc.getFileName(), finalizedChunks.size());

        } catch (Throwable t) {
            logger.error("Failed to ingest document: {}. Error: {}", jpaDoc.getFileName(), t.getMessage(), t);
            try {
                com.nexus.document.model.Document doc = documentRepository.findById(jpaDoc.getId()).orElse(jpaDoc);
                doc.setStatus("FAILED");
                documentRepository.save(doc);
            } catch (Exception ex) {
                logger.error("Failed to update document status to FAILED. Error: {}", ex.getMessage(), ex);
            }
        }
    }

    public void deleteDocumentVectors(com.nexus.document.model.Document jpaDoc) {
        if (jpaDoc.getChunkCount() != null && jpaDoc.getChunkCount() > 0) {
            List<String> idsToDelete = IntStream.range(0, jpaDoc.getChunkCount())
                    .mapToObj(i -> {
                        String chunkKey = jpaDoc.getId().toString() + "_" + i;
                        return UUID.nameUUIDFromBytes(chunkKey.getBytes(java.nio.charset.StandardCharsets.UTF_8)).toString();
                    })
                    .collect(Collectors.toList());
            
            logger.info("Deleting {} vectors from Qdrant for document ID: {}", idsToDelete.size(), jpaDoc.getId());
            try {
                vectorStore.delete(idsToDelete);
            } catch (Exception e) {
                logger.error("Failed to delete vectors from Qdrant for document ID: {}. Error: {}", jpaDoc.getId(), e.getMessage());
            }
        }
    }
}
