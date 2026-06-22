-- Enable UUID extension if not enabled (gen_random_uuid is built-in for PG 13+)
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'MEMBER',  -- ADMIN or MEMBER
    created_at TIMESTAMP DEFAULT now()
);

-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Workspace Members Table
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (workspace_id, user_id)
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),              -- PDF, DOCX, TXT
    status VARCHAR(30) DEFAULT 'PROCESSING',  -- PROCESSING, READY, FAILED
    chunk_count INT DEFAULT 0,
    file_content BYTEA,                 -- Raw file bytes for re-ingestion after restart
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT now()
);

-- Add file_content column if it doesn't exist (for existing deployments without this column)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_content BYTEA;


-- Chat Messages Table (for UI and metadata logging, alongside JDBC chat memory)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,                   -- USER or ASSISTANT
    content TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Mock HR Employees Table (for tool calling demo)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    leave_balance INT DEFAULT 20,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL
);

-- Spring AI Persistent Chat Memory Schema (for JdbcChatMemoryRepository)
CREATE TABLE IF NOT EXISTS SPRING_AI_CHAT_MEMORY (
    conversation_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL')),
    "timestamp" TIMESTAMP NOT NULL
);

-- Index for SPRING_AI_CHAT_MEMORY
CREATE INDEX IF NOT EXISTS SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_TIMESTAMP_IDX 
ON SPRING_AI_CHAT_MEMORY(conversation_id, "timestamp");
