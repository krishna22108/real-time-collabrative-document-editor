import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  ArrowUpDown, 
  FileText, 
  Settings, 
  Users, 
  Mail, 
  History, 
  Bell, 
  HelpCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = React.useState('');

  return (
    <div className="flex h-screen bg-[#f6f6f8] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white hidden md:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ArrowUpDown className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">SyncDocs</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem 
            to="/dashboard" 
            icon={<FileText className="w-5 h-5" />} 
            label="My Documents" 
            active={location.pathname === '/dashboard'} 
          />
          <NavItem 
            to="/shared" 
            icon={<Users className="w-5 h-5" />} 
            label="Shared With Me" 
            active={location.pathname === '/shared'} 
          />
          <NavItem 
            to="/invitations" 
            icon={<Mail className="w-5 h-5" />} 
            label="Invitations" 
            badge="3" 
            active={location.pathname === '/invitations'} 
          />
          <NavItem 
            to="/history" 
            icon={<History className="w-5 h-5" />} 
            label="Version History" 
            active={location.pathname === '/history'} 
          />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <NavItem 
              to="/settings" 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
              active={location.pathname === '/settings'} 
            />
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Plan</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                className="bg-primary h-full rounded-full" 
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">7.5 GB of 10 GB used</p>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm">
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-10">
          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents, people, or folders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm transition-all text-slate-900"
            />
          </div>

          <div className="flex items-center gap-6 ml-8">
            <button className="relative text-slate-400 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none text-slate-900">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Product Designer</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/alex/36/36" alt="Profile" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active = false, badge }: { to: string, icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <Link to={to} className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
      active ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-primary/5 hover:text-primary"
    )}>
      {icon}
      <span className="font-bold text-sm">{label}</span>
      {badge && (
        <span className="ml-auto bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {active && <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />}
    </Link>
  );
}
