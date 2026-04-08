import React from 'react';
import Layout from './Layout';
import { Mail, Check, X, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Invitations() {
  const invitations = [
    { id: '1', from: 'Sarah Chen', project: 'SyncDocs Redesign', time: '10 mins ago' },
    { id: '2', from: 'David Miller', project: 'API Documentation', time: '1 hour ago' },
    { id: '3', from: 'Jessica Alba', project: 'User Research Notes', time: '5 hours ago' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Invitations</h2>
        <p className="text-slate-500 mt-1 font-medium">Manage your pending document and workspace invitations.</p>
      </div>

      <div className="grid gap-4 max-w-3xl">
        {invitations.map((inv, index) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  <span className="font-bold">{inv.from}</span> invited you to collaborate on <span className="font-bold text-primary">"{inv.project}"</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{inv.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all">
                <X className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                <Check className="w-4 h-4" />
                Accept
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
