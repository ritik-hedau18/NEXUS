package com.nexus.workspace.controller;

import com.nexus.auth.model.User;
import com.nexus.workspace.dto.AddMemberRequest;
import com.nexus.workspace.dto.WorkspaceRequest;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(
            @Valid @RequestBody WorkspaceRequest request,
            @AuthenticationPrincipal User currentUser) {
        Workspace workspace = workspaceService.createWorkspace(request, currentUser);
        return ResponseEntity.ok(workspace);
    }

    @GetMapping
    public ResponseEntity<List<Workspace>> listWorkspaces(@AuthenticationPrincipal User currentUser) {
        List<Workspace> workspaces = workspaceService.getWorkspacesForUser(currentUser.getId());
        return ResponseEntity.ok(workspaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspace(@PathVariable("id") UUID id) {
        Workspace workspace = workspaceService.getWorkspaceById(id);
        return ResponseEntity.ok(workspace);
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isOwner(#id, principal)")
    public ResponseEntity<?> addMember(
            @PathVariable("id") UUID id,
            @Valid @RequestBody AddMemberRequest request) {
        try {
            Workspace workspace = workspaceService.addMember(id, request.getEmail(), request.getRole());
            return ResponseEntity.ok(workspace);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
