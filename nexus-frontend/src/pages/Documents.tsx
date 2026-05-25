import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { UploadCloud, FileText, Trash2, BookOpen, AlertCircle, Clock, CheckCircle, HelpCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import type { Document, DocumentSummary } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function Documents() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { fetchWorkspace } = useWorkspace();
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const isAdmin = user?.role === 'ADMIN' || currentWorkspace?.owner?.id === user?.id;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  // Summary modal state
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = React.useCallback(async (showLoading = true) => {
    if (!workspaceId) return;
    if (showLoading) setIsLoading(true);
    try {
      const response = await api.get<Document[]>(`/api/workspaces/${workspaceId}/documents`);
      setDocuments(response.data);
    } catch (err) {
      console.error(err);
      if (showLoading) {
        toast({
          title: 'Error',
          description: 'Failed to retrieve workspace documents.',
          variant: 'destructive',
        });
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [workspaceId, toast]);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchDocuments(true);
    }
  }, [workspaceId, fetchWorkspace, fetchDocuments]);

  // Poll documents if any are in PROCESSING status
  useEffect(() => {
    const hasProcessing = documents.some((doc) => doc.status === 'PROCESSING');
    if (!hasProcessing || !workspaceId) return;

    const intervalId = setInterval(() => {
      fetchDocuments(false);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [documents, workspaceId, fetchDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !workspaceId) return;

    setUploading(true);
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    try {
      await api.post(`/api/workspaces/${workspaceId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Document Uploaded',
        description: `"${file.name}" has been uploaded and is being processed.`,
        variant: 'success',
      });
      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Upload Failed',
        description: 'Failed to ingest file. Only PDF, DOCX, TXT files are supported.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

    try {
      await api.delete(`/api/workspaces/${workspaceId}/documents/${id}`);
      toast({
        title: 'Document Deleted',
        description: `"${fileName}" removed successfully.`,
        variant: 'success',
      });
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to delete the document.',
        variant: 'destructive',
      });
    }
  };

  const handleViewSummary = async (doc: Document) => {
    setSelectedDoc(doc);
    setLoadingSummary(true);
    setSummaryOpen(true);
    setSummary(null);

    try {
      const response = await api.post<DocumentSummary>(`/api/documents/${doc.id}/summary`);
      setSummary(response.data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Summary Generation Failed',
        description: 'Could not generate executive summary for this document.',
        variant: 'destructive',
      });
      setSummaryOpen(false);
    } finally {
      setLoadingSummary(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <Badge variant="success">Ready</Badge>;
      case 'PROCESSING':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping"></span>
            <span>Processing</span>
          </Badge>
        );
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar />

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Ingestion Area */}
          {isAdmin && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div 
                  className="border border-dashed border-white/20 hover:border-violet-500/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white/[0.02]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                    accept=".pdf,.docx,.txt"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold text-white">Ingesting & Indexing Knowledge...</span>
                      <p className="text-xs text-muted-foreground">Parsing chapters, generating vectors, storing to Qdrant.</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-violet-400" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">Upload Knowledge Document</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag & drop or click to choose file
                      </p>
                      <span className="text-xs text-muted-foreground bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                        PDF, DOCX, TXT (Max 10MB)
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ingested Materials</h3>
              <span className="text-xs text-muted-foreground font-medium">
                {documents.length} Files Total
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-white/10 rounded-xl p-12 text-center bg-white/[0.02]">
                <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Repository empty</h4>
                <p className="text-xs text-muted-foreground">Upload workspace materials to feed the neural core.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <FileText className="h-5 w-5 text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate max-w-[400px]">
                          {doc.fileName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground uppercase font-medium bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                            {doc.fileType || 'Doc'}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {doc.chunkCount > 0 ? `${doc.chunkCount} Chunks` : 'Pending Chunks'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(doc.status)}

                      {doc.status === 'READY' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 h-8 border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
                          onClick={() => handleViewSummary(doc)}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Summary</span>
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          onClick={() => handleDelete(doc.id, doc.fileName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Viewer Modal */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5 text-violet-400" />
              <span>AI Executive Summary</span>
            </DialogTitle>
            <DialogDescription>
              AI-generated summary and core takeaways for "{selectedDoc?.fileName}"
            </DialogDescription>
          </DialogHeader>

          {loadingSummary ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-white">Consolidating Document Context...</span>
              <p className="text-xs text-muted-foreground">Synthesizing semantic content and extracting key details.</p>
            </div>
          ) : summary ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                    Doc Type
                  </span>
                  <span className="text-sm font-extrabold text-white">{summary.documentType || 'Report'}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                    Read Time
                  </span>
                  <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{summary.estimatedReadTime || '5 min'}</span>
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                    Granularity
                  </span>
                  <span className="text-sm font-extrabold text-white">{selectedDoc?.chunkCount} Chunks</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-extrabold text-violet-300 uppercase tracking-widest">Core Summary</h4>
                <p className="text-sm text-foreground leading-relaxed bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  {summary.summary}
                </p>
              </div>

              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-cyan-300 uppercase tracking-widest">Key Takeaways</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((pt, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-red-400">
              <AlertCircle className="h-10 w-10 mb-2 text-red-500" />
              <span>Failed to load summary</span>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSummaryOpen(false)} className="cursor-pointer">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
