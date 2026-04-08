import React from 'react';
import { 
  ArrowUpDown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Chrome 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-4 font-sans selection:bg-primary/20">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="bg-primary p-2.5 rounded-xl text-white shadow-xl shadow-primary/30">
              <ArrowUpDown className="w-7 h-7" />
            </div>
            <h2 className="text-slate-900 text-3xl font-black tracking-tight">SyncDocs</h2>
          </motion.div>
          <p className="text-slate-500 font-medium">Streamline your documentation workflow</p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-2xl shadow-slate-200/50 rounded-3xl p-10 border border-slate-200"
        >
          <div className="mb-10">
            <h1 className="text-slate-900 text-2xl font-black leading-tight mb-2">Sign in to your account</h1>
            <p className="text-slate-500 text-sm font-medium">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-slate-700 text-xs font-bold uppercase tracking-widest" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  id="email"
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 text-xs font-bold uppercase tracking-widest" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
              Sign In
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-white px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
              <Chrome className="w-5 h-5 text-primary" />
              Continue with Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            Don't have an account? 
            <a href="#" className="font-bold text-primary hover:text-primary/80 transition-colors ml-1.5">Sign up</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
