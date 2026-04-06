package com.nexus.admin;

import com.nexus.chat.repository.ChatMessageRepository;
import com.nexus.document.model.Document;
import com.nexus.document.repository.DocumentRepository;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.repository.WorkspaceRepository;
import com.nexus.auth.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/workspaces/{id}")
public class AdminController {

    private final WorkspaceRepository workspaceRepository;
    private final DocumentRepository documentRepository;
    private final ChatMessageRepository chatMessageRepository;

    public AdminController(WorkspaceRepository workspaceRepository,
                          DocumentRepository documentRepository,
                          ChatMessageRepository chatMessageRepository) {
        this.workspaceRepository = workspaceRepository;
        this.documentRepository = documentRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isOwner(#workspaceId, principal)")
    public ResponseEntity<WorkspaceStats> getStats(@PathVariable("id") UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        List<Document> documents = documentRepository.findByWorkspaceId(workspaceId);
        long totalDocs = documents.size();
        long ready = documents.stream().filter(d -> "READY".equals(d.getStatus())).count();
        long processing = documents.stream().filter(d -> "PROCESSING".equals(d.getStatus())).count();
        long failed = documents.stream().filter(d -> "FAILED".equals(d.getStatus())).count();

        long totalMessages = chatMessageRepository.countByWorkspaceId(workspaceId);
        long memberCount = workspace.getMembers().size() + 1; // +1 for owner

        WorkspaceStats stats = WorkspaceStats.builder()
                .totalDocuments(totalDocs)
                .readyDocuments(ready)
                .processingDocuments(processing)
                .failedDocuments(failed)
                .totalChatMessages(totalMessages)
                .memberCount(memberCount)
                .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/members")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isOwner(#workspaceId, principal)")
    public ResponseEntity<List<MemberInfo>> getMembers(@PathVariable("id") UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));

        List<MemberInfo> membersList = new ArrayList<>();
        
        // Add owner
        User owner = workspace.getOwner();
        if (owner != null) {
            membersList.add(new MemberInfo(owner.getId(), owner.getName(), owner.getEmail(), "OWNER"));
        }

        // Add members
        if (workspace.getMembers() != null) {
            for (User u : workspace.getMembers()) {
                membersList.add(new MemberInfo(u.getId(), u.getName(), u.getEmail(), u.getRole().name()));
            }
        }

        return ResponseEntity.ok(membersList);
    }
}
