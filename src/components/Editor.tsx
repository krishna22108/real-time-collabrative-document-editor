import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Share2, History, Sparkles, ChevronLeft, Cloud, Star, Send, Link2, Download, Users, UserPlus, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSummary } from '../services/gemini';
import { cn } from '../lib/utils';
import RichTextEditor from './RichTextEditor';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('<p></p>');
  const [title, setTitle] = useState('Untitled Document');
  const [isOwner, setIsOwner] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [sharePermission, setSharePermission] = useState('edit');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentUser = { 
    id: 'user-' + Math.random().toString(36).substr(2, 9), 
    name: 'Alex Rivers', 
    email: 'alex@example.com'
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const doc = await res.json();
        setTitle(doc.title || 'Untitled Document');
        setContent(doc.content || '<p></p>');
        setHistory([doc.content || '']);
        setHistoryIndex(0);
        setIsFavorite(!!doc.is_favorite);
        setIsOwner(doc.owner === currentUser.id);
        setHasAccess(true);
      }
    } catch (err) {
      console.error('Error fetching document:', err);
    }
  };

  const saveDocument = useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
    } catch (err) {
      console.error('Error saving document:', err);
    }
    setIsSaving(false);
  }, [id, title, content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== history[historyIndex]) {
        saveDocument();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, title, history, historyIndex, saveDocument]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevContent = history[newIndex];
      setContent(prevContent);
      saveDocument();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = history[newIndex];
      setContent(nextContent);
      saveDocument();
    }
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    setShowSummary(true);
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const result = await generateSummary(plainText);
    setSummary(result || "No summary generated.");
    setIsSummarizing(false);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    saveDocument();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    saveDocument();
  };

  const downloadDocument = (format: 'html' | 'txt') => {
    let fileContent: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'html') {
      fileContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
      filename = `${title}.html`;
      mimeType = 'text/html';
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      fileContent = tempDiv.innerText;
      filename = `${title}.txt`;
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f6f6f8]">
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input 
                value={title} 
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                className="bg-transparent border-none focus:ring-0 p-0 font-semibold text-sm w-auto min-w-[100px] hover:bg-slate-50 rounded px-1 text-slate-900"
              />
              <Star 
                className={cn("w-3.5 h-3.5 cursor-pointer transition-colors", isFavorite ? "text-yellow-400 fill-yellow-400" : "text-slate-400 hover:text-yellow-400")} 
                onClick={toggleFavorite}
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Cloud className={cn("w-3 h-3", isSaving && "animate-pulse text-primary")} />
              <span>{isSaving ? 'Saving...' : 'All changes saved'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => downloadDocument('html')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 rounded-t-lg">
                Download as HTML
              </button>
              <button onClick={() => downloadDocument('txt')} className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 rounded-b-lg">
                Download as Text
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button 
            onClick={handleSummarize}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">AI Summary</span>
          </button>
          
          <button 
            onClick={() => setShowShareModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            {currentUser.name.charAt(0)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden" ref={editorContainerRef}>
        <div className="flex-1 flex flex-col">
          <RichTextEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
          />
        </div>

        <AnimatePresence>
          {showSummary && (
            <motion.aside 
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5 fill-primary/20" />
                  <h3 className="font-bold text-slate-900">AI Summary</h3>
                </div>
                <button onClick={() => setShowSummary(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                {isSummarizing ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
                    <div className="flex items-center gap-3 text-primary/60 mt-8">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-xs font-medium">Analyzing document...</span>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-slate">
                    <p>{summary}</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button 
                  onClick={handleSummarize}
                  className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-all"
                >
                  Regenerate
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Share Document</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Share via email</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        placeholder="Enter email address"
                        value={shareEmail}
                        onChange={e => setShareEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button 
                        onClick={async () => {
                          if (shareEmail) {
                            try {
                              const res = await fetch(`/api/documents/${id}/share`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email: shareEmail, permission: sharePermission })
                              });
                              const data = await res.json();
                              setShareLink(data.shareLink);
                            } catch (err) {
                              console.error('Error sharing document:', err);
                            }
                          }
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">Or share via link</span>
                    </div>
                  </div>
                  
                  {shareLink && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Share link</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={shareLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm"
                        />
                        <button 
                          onClick={copyShareLink}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="mt-4 w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowHistory(false)}
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Document History</h3>
                
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors",
                        index === historyIndex ? "bg-primary/10 border border-primary" : "bg-slate-50 hover:bg-slate-100"
                      )}
                      onClick={() => {
                        setHistoryIndex(index);
                        setContent(item);
                        saveDocument();
                      }}
                    >
                      <div className="text-sm font-medium text-slate-700">
                        Version {history.length - index}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowHistory(false)}
                  className="mt-4 w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
