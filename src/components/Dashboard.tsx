import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Grid, 
  List, 
  Filter, 
  ArrowUpDown, 
  ChevronDown,
  FileText,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Document } from '../types';
import Layout from './Layout';
import { motion } from 'motion/react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(setDocuments);
  }, []);

  const createNewDoc = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newDoc = {
      id,
      title: 'New Document',
      owner: 'Alex Rivers'
    };
    
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc)
    });
    
    navigate(`/editor/${id}`);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">My Documents</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and organize your synchronized files across devices.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-all", view === 'grid' ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-primary")}
            >
              <Grid className="w-4 h-4" />
              <span className="text-xs font-bold">Grid</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 px-3 rounded-md flex items-center gap-1.5 transition-all", view === 'list' ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-primary")}
            >
              <List className="w-4 h-4" />
              <span className="text-xs font-bold">List</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm text-slate-700">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm text-slate-700">
            <ArrowUpDown className="w-4 h-4" />
            Sort
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        {/* Create New Card */}
        <button 
          onClick={createNewDoc}
          className="group flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-primary/20 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all min-h-[220px]"
        >
          <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary group-hover:text-white text-primary rounded-full flex items-center justify-center mb-4 transition-all shadow-sm">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors text-slate-900">Create New Document</h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Start from a blank slate</p>
        </button>

        {documents.map(doc => (
          <DocumentCard key={doc.id} doc={doc} view={view} onClick={() => navigate(`/editor/${doc.id}`)} />
        ))}
      </div>
    </Layout>
  );
}

function DocumentCard({ doc, view, onClick }: { doc: Document, view: 'grid' | 'list', onClick: () => void }) {
  const isGrid = view === 'grid';
  
  return (
    <motion.div 
      layout
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer",
        isGrid ? "p-6 flex flex-col justify-between min-h-[220px]" : "p-4 flex items-center gap-4"
      )}
    >
      <div className={cn("flex items-start justify-between", !isGrid && "flex-1")}>
        <div className={cn(
          "rounded-xl flex items-center justify-center",
          isGrid ? "w-12 h-12 bg-blue-50 text-blue-600" : "w-10 h-10 bg-blue-50 text-blue-600"
        )}>
          <FileText className="w-6 h-6" />
        </div>
        {!isGrid && (
          <div className="flex-1 ml-4">
            <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{doc.title}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Edited {new Date(doc.updated_at).toLocaleDateString()}</p>
          </div>
        )}
        <button className="text-slate-400 hover:text-primary p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {isGrid && (
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">{doc.title}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Edited {new Date(doc.updated_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className={cn("flex items-center justify-between", isGrid ? "mt-6" : "ml-auto")}>
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
              <img src={`https://picsum.photos/seed/${doc.id + i}/32/32`} alt="User" referrerPolicy="no-referrer" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
            +4
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
          Internal
        </span>
      </div>
    </motion.div>
  );
}
