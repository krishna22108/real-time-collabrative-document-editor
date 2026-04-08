import React from 'react';
import Layout from './Layout';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Moon, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Settings() {
  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1 font-medium">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          <SettingsNavItem icon={<User className="w-4 h-4" />} label="Profile" active />
          <SettingsNavItem icon={<Bell className="w-4 h-4" />} label="Notifications" />
          <SettingsNavItem icon={<Shield className="w-4 h-4" />} label="Security" />
          <SettingsNavItem icon={<Globe className="w-4 h-4" />} label="Language" />
          <SettingsNavItem icon={<Moon className="w-4 h-4" />} label="Appearance" />
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Information</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-md">
                    <img src="https://picsum.photos/seed/alex/80/80" alt="Profile" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    Change
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Alex Rivera</h4>
                  <p className="text-sm text-slate-500">alex.rivera@example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Alex Rivera" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
                  <input type="text" defaultValue="Product Designer" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bio</label>
                  <textarea rows={3} defaultValue="Passionate about building collaborative tools that help teams work better together." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Email Notifications</h3>
            <div className="space-y-4">
              <Toggle label="Document mentions" description="Notify me when someone mentions me in a document." defaultChecked />
              <Toggle label="Shared documents" description="Notify me when someone shares a document with me." defaultChecked />
              <Toggle label="Comments" description="Notify me when someone comments on my documents." />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SettingsNavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
      active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-600 hover:bg-slate-100"
    )}>
      {icon}
      {label}
    </button>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) {
  const [enabled, setEnabled] = React.useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative shrink-0",
          enabled ? "bg-primary" : "bg-slate-200"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
          enabled ? "left-5" : "left-1"
        )} />
      </button>
    </div>
  );
}
