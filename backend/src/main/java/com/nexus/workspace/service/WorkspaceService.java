package com.nexus.workspace.service;

import com.nexus.auth.model.User;
import com.nexus.auth.repository.UserRepository;
import com.nexus.workspace.dto.WorkspaceRequest;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository, UserRepository userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Workspace createWorkspace(WorkspaceRequest request, User owner) {
        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();
        return workspaceRepository.save(workspace);
    }

    public List<Workspace> getWorkspacesForUser(UUID userId) {
        return workspaceRepository.findAllByUserId(userId);
    }

    public Workspace getWorkspaceById(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found with ID: " + workspaceId));
    }

    @Transactional
    public Workspace addMember(UUID workspaceId, String email, String role) {
        Workspace workspace = getWorkspaceById(workspaceId);
        User newMember = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with email " + email + " not found."));

        if (role != null) {
            try {
                newMember.setRole(com.nexus.auth.model.Role.valueOf(role.toUpperCase()));
                userRepository.save(newMember);
            } catch (IllegalArgumentException e) {
                // Ignore invalid roles
            }
        }

        workspace.getMembers().add(newMember);
        return workspaceRepository.save(workspace);
    }
}
