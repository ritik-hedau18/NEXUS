package com.nexus.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.auth.model.User;
import com.nexus.chat.model.ChatMessage;
import com.nexus.chat.repository.ChatMessageRepository;
import com.nexus.tools.GitHubToolService;
import com.nexus.tools.HRToolService;
import com.nexus.workspace.model.Workspace;
import com.nexus.workspace.repository.WorkspaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final ChatMessageRepository chatMessageRepository;
    private final WorkspaceRepository workspaceRepository;
    private final HRToolService hrToolService;
    private final GitHubToolService gitHubToolService;
    private final ObjectMapper objectMapper;
    private final ChatMemory chatMemory;

    public ChatService(ChatClient chatClient,
                       VectorStore vectorStore,
                       ChatMessageRepository chatMessageRepository,
                       WorkspaceRepository workspaceRepository,
                       HRToolService hrToolService,
                       GitHubToolService gitHubToolService,
                       ObjectMapper objectMapper,
                       ChatMemory chatMemory) {
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
        this.chatMessageRepository = chatMessageRepository;
        this.workspaceRepository = workspaceRepository;
        this.hrToolService = hrToolService;
        this.gitHubToolService = gitHubToolService;
        this.objectMapper = objectMapper;
        this.chatMemory = chatMemory;
    }

    @Transactional
    public void saveChatMessage(UUID workspaceId, User user, String sessionId, String role, String content) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found"));
        
        ChatMessage chatMessage = ChatMessage.builder()
                .workspace(workspace)
                .user(user)
                .sessionId(sessionId)
                .role(role)
                .content(content)
                .build();
        chatMessageRepository.save(chatMessage);
    }

    public Flux<String> streamChat(UUID workspaceId, String sessionId, String message, User currentUser) {
        // 1. Save USER message to database
        saveChatMessage(workspaceId, currentUser, sessionId, "USER", message);

        // 2. Perform raw vector search from Qdrant filtered by workspaceId
        List<Document> similarDocs = Collections.emptyList();
        try {
            FilterExpressionBuilder b = new FilterExpressionBuilder();
            Filter.Expression filterExpression = b.eq("workspaceId", workspaceId.toString()).build();
            
            SearchRequest searchRequest = SearchRequest.builder()
                    .query(message)
                    .topK(4)
                    .filterExpression(filterExpression)
                    .build();
            similarDocs = vectorStore.similaritySearch(searchRequest);
        } catch (Exception e) {
            logger.error("Error searching vector store: {}", e.getMessage());
        }

        // 3. Construct Context from retrieved chunks
        final String context;
        if (!similarDocs.isEmpty()) {
            context = similarDocs.stream()
                    .map(Document::getText)
                    .collect(Collectors.joining("\n\n---\n\n"));
        } else {
            context = "No context documents found.";
        }

        // 4. Create source citations list
        final List<Map<String, String>> citations = similarDocs.stream()
                .map(doc -> {
                    Map<String, String> citation = new HashMap<>();
                    citation.put("fileName", (String) doc.getMetadata().getOrDefault("fileName", "Unknown"));
                    citation.put("snippet", doc.getText());
                    return citation;
                })
                .collect(Collectors.toList());

        String systemPromptText = """
                You are NEXUS, an intelligent enterprise workspace assistant.
                Use ONLY the provided context from uploaded documents to answer the user's question.
                If some parts of the question cannot be answered using the context, clearly state which parts you could not find in the workspace documents, but answer the other parts that are present in the context. If none of the question can be answered using the context, say "I couldn't find this in your workspace documents."
                Answer directly and concisely. Do NOT mention which file or document the answer comes from — source citations are displayed separately in the UI.
                
                Context:
                {context}
                """;

        String conversationId = workspaceId.toString() + "_" + currentUser.getId().toString() + "_" + sessionId;

        StringBuilder assistantAnswer = new StringBuilder();

        // 5. Generate and stream tokens from Groq
        Flux<String> tokenFlux = chatClient.prompt()
                .system(sp -> sp.text(systemPromptText).param("context", context))
                .user(message)
                .tools(hrToolService, gitHubToolService)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, conversationId))
                .stream()
                .content()
                .doOnNext(assistantAnswer::append);

        // 6. Concat source citations metadata at the end of the token stream
        Flux<String> metadataFlux = Flux.defer(() -> {
            // Save Assistant response when stream finishes
            saveChatMessage(workspaceId, currentUser, sessionId, "ASSISTANT", assistantAnswer.toString());

            try {
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("citations", citations);
                String json = objectMapper.writeValueAsString(metadata);
                return Flux.just("\n[METADATA]" + json);
            } catch (Exception e) {
                logger.error("Failed to serialize citations: {}", e.getMessage());
                return Flux.just("\n[METADATA]{\"citations\":[]}");
            }
        });

        return Flux.concat(tokenFlux, metadataFlux);
    }

    public List<ChatMessage> getChatHistory(UUID workspaceId, String sessionId, UUID userId) {
        return chatMessageRepository.findByWorkspaceIdAndSessionIdAndUserIdOrderByCreatedAtAsc(workspaceId, sessionId, userId);
    }

    @Transactional
    public void clearChat(UUID workspaceId, String sessionId, UUID userId) {
        chatMessageRepository.deleteByWorkspaceIdAndSessionIdAndUserId(workspaceId, sessionId, userId);
        String conversationId = workspaceId.toString() + "_" + userId.toString() + "_" + sessionId;
        chatMemory.clear(conversationId);
    }
}
