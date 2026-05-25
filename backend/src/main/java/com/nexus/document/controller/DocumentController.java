package com.nexus.document.controller;

import com.nexus.auth.model.User;
import com.nexus.document.model.Document;
import com.nexus.document.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isMemberOrOwner(#workspaceId, principal)")
    public ResponseEntity<List<Document>> listDocuments(@PathVariable("workspaceId") UUID workspaceId) {
        List<Document> documents = documentService.getDocumentsByWorkspace(workspaceId);
        return ResponseEntity.ok(documents);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isOwner(#workspaceId, principal)")
    public ResponseEntity<?> uploadDocument(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        try {
            Document doc = documentService.uploadDocument(workspaceId, file, currentUser);
            return ResponseEntity.ok(doc);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error uploading file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{docId}")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isOwner(#workspaceId, principal)")
    public ResponseEntity<?> deleteDocument(
            @PathVariable("workspaceId") UUID workspaceId,
            @PathVariable("docId") UUID docId) {
        try {
            documentService.deleteDocument(docId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
