import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { 
  MessageSquare, 
  Files, 
  Search, 
  ShieldAlert, 
  LogOut, 
  Briefcase,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { currentWorkspace, workspaces } = useWorkspace();
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const isWorkspaceOwner = currentWorkspace?.owner?.id === user?.id;
  const hasAdminPrivilege = user?.role === 'ADMIN' || isWorkspaceOwner;

  return (
    <aside className="w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span className="font-black text-white text-base tracking-wider">N</span>
        </div>
        <span className="font-extrabold text-xl tracking-tight gradient-text">NEXUS</span>
      </div>

      <Separator className="bg-white/10" />

      {/* Workspace Switcher/Context */}
      <div className="p-4">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 text-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-violet-400" />
            <span className="font-semibold truncate max-w-[130px]">
              {currentWorkspace?.name || 'Loading Workspace...'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <NavLink
          to={`/workspace/${workspaceId}/chat`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-violet-600/25 to-cyan-600/25 border-l-2 border-violet-500 text-white'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`
          }
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </NavLink>

        <NavLink
          to={`/workspace/${workspaceId}/documents`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-violet-600/25 to-cyan-600/25 border-l-2 border-violet-500 text-white'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Files className="h-4 w-4" />
          <span>Documents</span>
        </NavLink>

        <NavLink
          to={`/workspace/${workspaceId}/search`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-violet-600/25 to-cyan-600/25 border-l-2 border-violet-500 text-white'
                : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Search className="h-4 w-4" />
          <span>Semantic Search</span>
        </NavLink>

        {hasAdminPrivilege && (
          <NavLink
            to={`/workspace/${workspaceId}/admin`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/25 to-cyan-600/25 border-l-2 border-violet-500 text-white'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`
            }
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>

      {/* Back to Workspaces Button */}
      <div className="px-4 mb-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-white/5 bg-white/5 hover:bg-white/10"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to workspaces</span>
        </Button>
      </div>

      <Separator className="bg-white/10" />

      {/* User profile footer */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-white leading-none mb-1">
              {user?.name}
            </p>
            <span className="text-[10px] text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded uppercase font-medium">
              {user?.role}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
          onClick={logout}
          title="Log Out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
