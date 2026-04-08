import React from 'react';
import Layout from './Layout';
import { History, RotateCcw, User, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function VersionHistory() {
  const history = [
    { id: '1', version: 'v2.4.0', user: 'Alex Rivera', date: 'Feb 21, 2026 04:05 PM', changes: 'Added AI summary feature' },
    { id: '2', version: 'v2.3.1', user: 'Sarah Chen', date: 'Feb 20, 2026 11:30 AM', changes: 'Fixed real-time cursor lag' },
    { id: '3', version: 'v2.3.0', user: 'Alex Rivera', date: 'Feb 19, 2026 09:15 AM', changes: 'Initial document structure' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Version History</h2>
        <p className="text-slate-500 mt-1 font-medium">Track changes and restore previous versions of your documents.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Version</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Modified By</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Changes</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item, index) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md">{item.version}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${item.user}/24/24`} alt="" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.changes}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1 ml-auto">
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
