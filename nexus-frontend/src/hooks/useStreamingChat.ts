import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '@/api/axios';
import type { ChatMessage } from '@/types';

interface Citation {
  fileName: string;
  chunkIndex: number;
}

interface UseStreamingChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  citations: Citation[];
  sendMessage: (workspaceId: string, sessionId: string, message: string) => Promise<void>;
  loadHistory: (workspaceId: string, sessionId: string) => Promise<void>;
  clearMessages: () => void;
  clearHistory: (workspaceId: string, sessionId: string) => Promise<void>;
}

export function useStreamingChat(): UseStreamingChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadHistory = useCallback(async (workspaceId: string, sessionId: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/history?workspaceId=${workspaceId}&sessionId=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const history: ChatMessage[] = await response.json();
        setMessages(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  const sendMessage = useCallback(
    async (workspaceId: string, sessionId: string, message: string) => {
      if (isStreaming) return;

      const token = localStorage.getItem('accessToken');
      setCitations([]);

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'USER',
        content: message,
        sessionId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Create placeholder assistant message
      const assistantId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'ASSISTANT',
        content: '',
        sessionId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      try {
        const url = `${API_BASE_URL}/api/chat/stream?workspaceId=${encodeURIComponent(workspaceId)}&sessionId=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(message)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Stream request failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE format
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5);
              const trimmedData = data.trim();

              // Check for metadata suffix with citations
              if (trimmedData.startsWith('[METADATA]')) {
                try {
                  const metaJson = trimmedData.replace('[METADATA]', '').trim();
                  const metadata = JSON.parse(metaJson);
                  if (metadata.citations) {
                    setCitations(metadata.citations);
                  }
                } catch {
                  // Not valid JSON metadata, ignore
                }
              } else if (trimmedData === '[DONE]') {
                // Stream complete
              } else {
                accumulatedContent += data;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // User cancelled
        } else {
          console.error('Streaming error:', error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    content: 'Sorry, an error occurred while generating the response. Please try again.',
                  }
                : msg
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCitations([]);
  }, []);

  const clearHistory = useCallback(async (workspaceId: string, sessionId: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(
        `${API_BASE_URL}/api/chat/history?workspaceId=${encodeURIComponent(workspaceId)}&sessionId=${encodeURIComponent(sessionId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
    setMessages([]);
    setCitations([]);
  }, []);

  return {
    messages,
    isStreaming,
    citations,
    sendMessage,
    loadHistory,
    clearMessages,
    clearHistory,
  };
}
