import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { 
  Users, 
  Files, 
  MessageSquare, 
  ShieldAlert, 
  Plus, 
  UserPlus, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import type { WorkspaceStats, MemberInfo } from '@/types';
const getRoleBadge = (role: string) => {
  let styles = '';
  if (role === 'OWNER') {
    styles = 'bg-violet-500/10 text-violet-300 border-violet-500/20';
  } else if (role === 'ADMIN') {
    styles = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
  } else {
    styles = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles}`}>
      {role}
    </span>
  );
};

export default function Admin() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { fetchWorkspace, addMember } = useWorkspace();
  const { toast } = useToast();

  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Members list state
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Invite member state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);

  const fetchMembers = async () => {
    if (!workspaceId) return;
    setLoadingMembers(true);
    try {
      const response = await api.get<MemberInfo[]>(`/api/admin/workspaces/${workspaceId}/members`);
      setMembers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchStats();
      fetchMembers();
    }
  }, [workspaceId]);

  const fetchStats = async () => {
    if (!workspaceId) return;
    setLoadingStats(true);
    try {
      const response = await api.get<WorkspaceStats>(`/api/admin/workspaces/${workspaceId}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch workspace analytics.',
        variant: 'destructive',
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !workspaceId) return;

    setInviting(true);
    try {
      await addMember(workspaceId, email, role);
      toast({
        title: 'Member Added',
        description: `"${email}" was added as ${role}.`,
        variant: 'success',
      });
      setEmail('');
      // Refresh stats since memberCount changes
      fetchStats();
      fetchMembers();
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Operation Failed',
        description: err.response?.data?.message || 'Failed to add workspace member.',
        variant: 'destructive',
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar />

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Stats Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Workspace Analytics</h3>

            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-28 border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Documents Metric */}
                <Card className="border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Total Documents
                      </span>
                      <h4 className="text-3xl font-extrabold text-white mt-1">
                        {stats.totalDocuments}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-green-400 flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" /> {stats.readyDocuments}
                        </span>
                        <span className="text-yellow-400 flex items-center gap-0.5">
                          <Clock className="h-3 w-3 animate-pulse" /> {stats.processingDocuments}
                        </span>
                        <span className="text-red-400 flex items-center gap-0.5">
                          <XCircle className="h-3 w-3" /> {stats.failedDocuments}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                      <Files className="h-6 w-6 text-violet-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Messages Metric */}
                <Card className="border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        AI Conversations
                      </span>
                      <h4 className="text-3xl font-extrabold text-white mt-1">
                        {stats.totalChatMessages}
                      </h4>
                      <span className="text-xs text-muted-foreground block mt-2">
                        Total messages generated
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Members Metric */}
                <Card className="border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Seat Count
                      </span>
                      <h4 className="text-3xl font-extrabold text-white mt-1">
                        {stats.memberCount}
                      </h4>
                      <span className="text-xs text-muted-foreground block mt-2">
                        Workspace active collaborators
                      </span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-indigo-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-sm text-red-400">Failed to render stats.</div>
            )}
          </div>

          {/* User Management Section */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-violet-400" />
                  <span>Invite Collaborator</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Grant a user access context to this workspace. Added members can search vectors and stream chat responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      User Email
                    </label>
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={inviting}
                      required
                    />
                  </div>
                  <div className="w-48 space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Role Privilege
                    </label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-[#12121a] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={inviting}
                    >
                      <option value="MEMBER">Member (Read & Chat)</option>
                      <option value="ADMIN">Admin (Full access)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={inviting || !email.trim()} className="h-10 cursor-pointer">
                      {inviting ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        'Add Member'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Workspace Members Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-400" />
                  <span>Workspace Members</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  View users who have access to this workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMembers ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] animate-pulse">
                        <div className="h-9 w-9 rounded-full bg-white/5" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-white/5 rounded" />
                          <div className="h-3 w-48 bg-white/5 rounded" />
                        </div>
                        <div className="h-6 w-16 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mb-2 opacity-55" />
                    <span>No members yet in this workspace.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                            {member.name ? member.name.slice(0, 2) : 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {member.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-4">
                          {getRoleBadge(member.role)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
