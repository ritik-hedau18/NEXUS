import React from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { Separator } from './ui/separator';

export default function Navbar() {
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/chat')) return 'AI Workspace Chat';
    if (path.includes('/documents')) return 'Knowledge Repository';
    if (path.includes('/search')) return 'Semantic Search';
    if (path.includes('/admin')) return 'Admin Control Center';
    return 'Nexus Workspace';
  };

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-violet-400">
          {currentWorkspace?.name || 'Workspace'}
        </span>
        <Separator orientation="vertical" className="h-4 bg-white/10" />
        <h1 className="text-base font-bold text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Subtle decorative dot showing system status */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gateway Active</span>
        </div>
      </div>
    </header>
  );
}
