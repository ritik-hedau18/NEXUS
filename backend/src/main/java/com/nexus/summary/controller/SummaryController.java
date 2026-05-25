package com.nexus.summary.controller;

import com.nexus.summary.DocumentSummary;
import com.nexus.summary.SummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/documents/{id}/summary")
public class SummaryController {

    private final SummaryService summaryService;

    public SummaryController(SummaryService summaryService) {
        this.summaryService = summaryService;
    }

    @PostMapping
    public ResponseEntity<?> getSummary(@PathVariable("id") UUID id) {
        try {
            DocumentSummary summary = summaryService.generateSummary(id);
            return ResponseEntity.ok(summary);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
