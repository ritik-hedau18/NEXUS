package com.nexus.search.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SemanticSearchService {
    private static final Logger logger = LoggerFactory.getLogger(SemanticSearchService.class);

    private final VectorStore vectorStore;

    public SemanticSearchService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public List<Map<String, Object>> search(UUID workspaceId, String query) {
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        Filter.Expression filterExpression = b.eq("workspaceId", workspaceId.toString()).build();

        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(10)
                .similarityThreshold(0.3)
                .filterExpression(filterExpression)
                .build();

        List<Document> results = vectorStore.similaritySearch(request);

        return results.stream().map(doc -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("fileName", doc.getMetadata().getOrDefault("fileName", "Unknown"));
            entry.put("chunkIndex", doc.getMetadata().getOrDefault("chunkIndex", -1));
            entry.put("documentId", doc.getMetadata().getOrDefault("documentId", ""));
            entry.put("snippet", doc.getText());
            return entry;
        }).collect(Collectors.toList());
    }
}
