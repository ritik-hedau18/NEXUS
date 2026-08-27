package com.nexus.config;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.PayloadSchemaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class QdrantIndexInitializer implements ApplicationRunner {
    private static final Logger logger = LoggerFactory.getLogger(QdrantIndexInitializer.class);

    @Autowired(required = false)
    private QdrantClient qdrantClient;

    @Value("${spring.ai.vectorstore.qdrant.collection-name:nexus-docs}")
    private String collectionName;

    @Override
    public void run(ApplicationArguments args) {
        if (qdrantClient == null) {
            logger.info("QdrantClient is not configured; skipping payload index creation.");
            return;
        }

        createIndexSafely("workspaceId");
        createIndexSafely("documentId");
    }

    private void createIndexSafely(String fieldName) {
        try {
            logger.info("Creating Qdrant payload keyword index for field '{}' on collection '{}'...", fieldName, collectionName);
            qdrantClient.createPayloadIndexAsync(
                collectionName,
                fieldName,
                PayloadSchemaType.Keyword,
                null,
                true,
                null,
                null
            ).get();
            logger.info("Successfully created Qdrant payload index for field '{}'.", fieldName);
        } catch (Exception e) {
            logger.warn("Could not create payload index for field '{}' (it may already exist or collection not ready yet): {}", fieldName, e.getMessage());
        }
    }
}
