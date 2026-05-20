import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Search as SearchIcon, FileText, LayoutGrid, CheckCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import type { SearchResult } from '@/types';

export default function Search() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { fetchWorkspace } = useWorkspace();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
    }
  }, [workspaceId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !workspaceId) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get<SearchResult[]>(
        `/api/search?workspaceId=${workspaceId}&query=${encodeURIComponent(query)}&limit=10`
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Search Failed',
        description: 'Failed to retrieve semantic search results.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Navbar />

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Query Bar */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    className="pl-11 h-12 bg-white/5 border-white/10 text-foreground"
                    placeholder="Enter query to execute semantic vector similarity search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="h-12 px-6 cursor-pointer" disabled={loading || !query.trim()}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    'Search Vectors'
                  )}
                </Button>
              </form>
              <div className="mt-2.5 text-[10px] text-muted-foreground px-1">
                Returns direct similarity hits from Qdrant vector store, completely bypassing LLM generations.
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            {hasSearched && (
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Similarity Matches</h3>
                <span className="text-xs text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  {results.length} Matches Found
                </span>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : results.length === 0 ? (
              hasSearched ? (
                <div className="flex flex-col items-center justify-center border border-white/10 rounded-xl p-12 text-center bg-white/[0.02]">
                  <LayoutGrid className="h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">No semantic hits found</h4>
                  <p className="text-xs text-muted-foreground">Try refining your search terms or expanding the document corpus.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-16 text-center bg-white/[0.01]">
                  <SearchIcon className="h-10 w-10 text-muted-foreground mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1">Ready for Querying</h4>
                  <p className="text-xs text-muted-foreground">Submit a phrase to search across your workspace knowledge base.</p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                {results.map((res, idx) => (
                  <Card key={idx} className="border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all duration-300">
                    <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                        <span className="text-xs font-extrabold text-violet-300 truncate max-w-[400px]">
                          {res.fileName}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-mono">
                        Chunk #{res.chunkIndex}
                      </span>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-foreground leading-relaxed bg-white/[0.02] border border-white/5 p-3 rounded-lg font-normal">
                        {res.snippet}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
