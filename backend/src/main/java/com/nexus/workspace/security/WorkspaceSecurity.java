package com.nexus.workspace.security;

import com.nexus.auth.model.User;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.repository.WorkspaceRepository;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("workspaceSecurity")
public class WorkspaceSecurity {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceSecurity(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public boolean isOwner(UUID workspaceId, Object principal) {
        if (!(principal instanceof User user)) {
            return false;
        }
        return workspaceRepository.findById(workspaceId)
                .map(workspace -> workspace.getOwner() != null && workspace.getOwner().getId().equals(user.getId()))
                .orElse(false);
    }

    public boolean isMemberOrOwner(UUID workspaceId, Object principal) {
        if (!(principal instanceof User user)) {
            return false;
        }
        return workspaceRepository.findById(workspaceId)
                .map(workspace -> {
                    // Check if owner
                    if (workspace.getOwner() != null && workspace.getOwner().getId().equals(user.getId())) {
                        return true;
                    }
                    // Check if member
                    if (workspace.getMembers() != null) {
                        return workspace.getMembers().stream()
                                .anyMatch(member -> member.getId().equals(user.getId()));
                    }
                    return false;
                })
                .orElse(false);
    }
}
