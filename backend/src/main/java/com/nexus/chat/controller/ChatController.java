package com.nexus.chat.controller;

import com.nexus.auth.model.User;
import com.nexus.chat.model.ChatMessage;
import com.nexus.chat.service.ChatService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isMemberOrOwner(#workspaceId, principal)")
    public Flux<String> streamChat(
            @RequestParam("workspaceId") UUID workspaceId,
            @RequestParam("sessionId") String sessionId,
            @RequestParam("message") String message,
            @AuthenticationPrincipal User currentUser) {
        return chatService.streamChat(workspaceId, sessionId, message, currentUser);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isMemberOrOwner(#workspaceId, principal)")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @RequestParam("workspaceId") UUID workspaceId,
            @RequestParam("sessionId") String sessionId,
            @AuthenticationPrincipal User currentUser) {
        List<ChatMessage> history = chatService.getChatHistory(workspaceId, sessionId, currentUser.getId());
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history")
    @PreAuthorize("hasRole('ADMIN') or @workspaceSecurity.isMemberOrOwner(#workspaceId, principal)")
    public ResponseEntity<Void> clearHistory(
            @RequestParam("workspaceId") UUID workspaceId,
            @RequestParam("sessionId") String sessionId,
            @AuthenticationPrincipal User currentUser) {
        chatService.clearChat(workspaceId, sessionId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
