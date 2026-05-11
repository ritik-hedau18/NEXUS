import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import type { Workspace } from '@/types';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string, description: string) => Promise<Workspace>;
  addMember: (workspaceId: string, email: string, role: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [workspaces, setSetWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Workspace[]>('/api/workspaces');
      setSetWorkspaces(response.data);
    } catch (err) {
      setError('Failed to fetch workspaces');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWorkspace = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Workspace>(`/api/workspaces/${id}`);
      setCurrentWorkspace(response.data);
    } catch (err) {
      setError('Failed to fetch workspace');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWorkspace = useCallback(async (name: string, description: string) => {
    const response = await api.post<Workspace>('/api/workspaces', {
      name,
      description,
    });
    setSetWorkspaces((prev) => [...prev, response.data]);
    return response.data;
  }, []);

  const addMember = useCallback(async (workspaceId: string, email: string, role: string) => {
    await api.post(`/api/workspaces/${workspaceId}/members`, {
      email,
      role,
    });
  }, []);

  // Fetch workspaces once authenticated on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    } else {
      // Clear workspace states on logout
      setSetWorkspaces([]);
      setCurrentWorkspace(null);
    }
  }, [fetchWorkspaces, isAuthenticated]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        isLoading,
        error,
        fetchWorkspaces,
        fetchWorkspace,
        createWorkspace,
        addMember,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
