package com.nexus.search.controller;

import com.nexus.search.service.SemanticSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SemanticSearchService semanticSearchService;

    public SearchController(SemanticSearchService semanticSearchService) {
        this.semanticSearchService = semanticSearchService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isMemberOrOwner(#workspaceId, principal)")
    public ResponseEntity<List<Map<String, Object>>> search(
            @RequestParam("workspaceId") UUID workspaceId,
            @RequestParam("query") String query) {
        List<Map<String, Object>> results = semanticSearchService.search(workspaceId, query);
        return ResponseEntity.ok(results);
    }
}
