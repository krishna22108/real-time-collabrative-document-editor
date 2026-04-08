import React from 'react';
import Layout from './Layout';
import { Users, MoreHorizontal, FileText, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function SharedWithMe() {
  const sharedDocs = [
    { id: '1', title: 'Q4 Marketing Strategy', owner: 'Sarah Chen', date: '2 hours ago' },
    { id: '2', title: 'Product Roadmap 2026', owner: 'Michael Scott', date: 'Yesterday' },
    { id: '3', title: 'Design System Guidelines', owner: 'Emma Watson', date: '3 days ago' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Shared With Me</h2>
        <p className="text-slate-500 mt-1 font-medium">Documents shared with you by your team members.</p>
      </div>

      <div className="grid gap-4">
        {sharedDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{doc.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Owned by {doc.owner}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Shared {doc.date}
                </p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
