import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, CornerDownLeft, FileText, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function Chat() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { fetchWorkspace } = useWorkspace();
  const { messages, isStreaming, citations, sendMessage, loadHistory, clearMessages, clearHistory } = useStreamingChat();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionId = 'default-session';

  // Fetch workspace details on mount
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      clearMessages();
      loadHistory(workspaceId, sessionId);
    }
  }, [workspaceId, fetchWorkspace, loadHistory, clearMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || !workspaceId) return;

    const messageText = input;
    setInput('');
    await sendMessage(workspaceId, sessionId, messageText);
  };

  const handleClearChat = async () => {
    if (!workspaceId || isStreaming) return;
    if (window.confirm("Are you sure you want to clear this chat history? This will delete all messages and reset the AI's conversation memory.")) {
      await clearHistory(workspaceId, sessionId);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-6">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Workspace Intelligence Gate</h2>
              <p className="text-sm text-muted-foreground">
                Ask questions about your workspace documents. The AI agent will search for relevant passages, unify knowledge, and cite sources.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-end border-b border-white/5 pb-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  disabled={isStreaming}
                  className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Chat History
                </Button>
              </div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ASSISTANT' && (
                    <div className="h-9 w-9 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-violet-400" />
                    </div>
                  )}

                  <div className="max-w-[75%] flex flex-col gap-1.5">
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'USER'
                          ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/10'
                          : 'bg-white/5 border border-white/10 text-foreground backdrop-blur-xl'
                      }`}
                    >
                      {msg.content || (
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce"></span>
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      )}
                    </div>

                    {/* Citations block for AI answers */}
                    {msg.role === 'ASSISTANT' && !isStreaming && citations.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1 px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Unified Sources ({citations.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {citations.map((cite, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-violet-300 font-medium"
                              title={`Chunk index: ${cite.chunkIndex}`}
                            >
                              <FileText className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{cite.fileName}</span>
                              <span className="text-[10px] text-muted-foreground">#C{cite.chunkIndex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'USER' && (
                    <div className="h-9 w-9 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-cyan-400" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-[#0a0a0f] px-8 py-4">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
            <Input
              className="pr-16 h-12 bg-white/5 border-white/10 text-foreground"
              placeholder="Ask anything about the ingested documents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
            />
            <div className="absolute right-3 flex items-center gap-2">
              {isStreaming ? (
                <div className="h-5 w-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  disabled={!input.trim() || isStreaming}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
          <div className="max-w-4xl mx-auto flex justify-between items-center mt-2 px-1 text-[10px] text-muted-foreground">
            <span>LLM Model: llama-3.3-70b-versatile via Groq API</span>
            <div className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
