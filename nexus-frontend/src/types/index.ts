export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  status: 'PROCESSING' | 'READY' | 'FAILED';
  chunkCount: number;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  sessionId: string;
  createdAt: string;
}

export interface SearchResult {
  fileName: string;
  chunkIndex: number;
  documentId: string;
  snippet: string;
}

export interface DocumentSummary {
  title: string;
  summary: string;
  keyPoints: string[];
  documentType: string;
  estimatedReadTime: string;
}

export interface WorkspaceStats {
  totalDocuments: number;
  readyDocuments: number;
  processingDocuments: number;
  failedDocuments: number;
  totalChatMessages: number;
  memberCount: number;
}

export interface MemberInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}
