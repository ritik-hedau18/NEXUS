package com.nexus.chat.repository;

import com.nexus.chat.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByWorkspaceIdAndSessionIdAndUserIdOrderByCreatedAtAsc(UUID workspaceId, String sessionId, UUID userId);
    List<ChatMessage> findByWorkspaceIdOrderByCreatedAtAsc(UUID workspaceId);
    void deleteByWorkspaceIdAndSessionIdAndUserId(UUID workspaceId, String sessionId, UUID userId);
    
    long countByWorkspaceId(UUID workspaceId);
}
