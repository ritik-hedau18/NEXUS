import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './hooks/useWorkspace';
import { ToastProvider } from './components/ui/toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Documents from './pages/Documents';
import Search from './pages/Search';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Workspace & Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workspace/:workspaceId/chat" element={<Chat />} />
                <Route path="/workspace/:workspaceId/documents" element={<Documents />} />
                <Route path="/workspace/:workspaceId/search" element={<Search />} />
                <Route path="/workspace/:workspaceId/admin" element={<Admin />} />
                
                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WorkspaceProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

