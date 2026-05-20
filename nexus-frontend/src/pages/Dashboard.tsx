import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Briefcase, ChevronRight, LogOut, ArrowRight, User } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function Dashboard() {
  const { workspaces, isLoading, error, fetchWorkspaces, createWorkspace } = useWorkspace();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const workspace = await createWorkspace(name, description);
      toast({
        title: 'Workspace Created',
        description: `"${workspace.name}" is now ready.`,
        variant: 'success',
      });
      setOpen(false);
      setName('');
      setDescription('');
      navigate(`/workspace/${workspace.id}/chat`);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Operation Failed',
        description: 'Failed to create workspace. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground flex flex-col relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="font-black text-white text-base tracking-wider">N</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight gradient-text">NEXUS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <User className="h-4 w-4 text-violet-400" />
            <span className="font-medium text-white">{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Dashboard Main Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-12 z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Workspaces</h2>
            <p className="text-muted-foreground mt-1">Select a workspace context to start querying files.</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Create Workspace</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-44 border-white/5 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-16 text-center max-w-md mx-auto mt-12 bg-white/5 backdrop-blur-xl">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No workspaces found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create a workspace to initialize your neural knowledge environment.
            </p>
            <Button onClick={() => setOpen(true)} className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <Card 
                key={ws.id} 
                className="group border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(`/workspace/${ws.id}/chat`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                      {ws.name}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-colors">
                      <Briefcase className="h-4 w-4 text-violet-400" />
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground text-sm line-clamp-2 mt-1">
                    {ws.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-white/5 py-3 flex items-center justify-between text-xs text-muted-foreground group-hover:text-white transition-colors">
                  <span>Created {new Date(ws.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Enter</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Workspace Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Workspaces isolate your uploaded documents, embedding databases, and chat histories.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Workspace Name</label>
              <Input
                placeholder="e.g. Engineering Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Description (Optional)</label>
              <Input
                placeholder="Brief summary of context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
