import React from 'react';
import { 
  ArrowUpDown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Chrome,
  Sparkles,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [rememberMe, setRememberMe] = React.useState(() => {
    return localStorage.getItem('rememberMe') === 'true';
  });
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = mode === 'signin' ? '/signin' : '/signup';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('rememberMe', String(rememberMe));
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            top: '-20%', 
            left: '-10%'
          }}
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
            bottom: '-10%', 
            right: '-5%'
          }}
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 80, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
            top: '40%', 
            right: '20%'
          }}
          animate={{ 
            x: [0, 60, 0], 
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: [null, Math.random() * -200 - 50],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-3"
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl text-white shadow-2xl shadow-indigo-500/40">
                <ArrowUpDown className="w-8 h-8" />
              </div>
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
              </motion.div>
            </motion.div>
            <h2 className="text-white text-3xl font-black tracking-tight">SyncDocs</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-medium"
          >
            Streamline your documentation workflow
          </motion.p>
        </div>

        {/* Card */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/10 backdrop-blutter-xl backdrop-blur-xl shadow-2xl shadow-black/20 rounded-3xl p-10 border border-white/10 relative overflow-hidden"
        >
          {/* Card shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          {/* Mode Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'signin' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'signup' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6 relative">
            <h1 className="text-white text-2xl font-black leading-tight mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {mode === 'signin' ? 'Sign in to continue to your workspace' : 'Get started with your free account'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-widest" htmlFor="name">Full Name</label>
                <motion.div 
                  animate={{ 
                    boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(99,102,241,0.3)' : '0 0 0 1px rgba(255,255,255,0.1)'
                  }}
                  className="relative rounded-2xl bg-white/5 border border-white/10"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none transition-all"
                    required={mode === 'signup'}
                  />
                </motion.div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-slate-300 text-xs font-bold uppercase tracking-widest" htmlFor="email">Email address</label>
              <motion.div 
                animate={{ 
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(99,102,241,0.3)' : '0 0 0 1px rgba(255,255,255,0.1)'
                }}
                className="relative rounded-2xl bg-white/5 border border-white/10"
              >
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none transition-all"
                  required
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-xs font-bold uppercase tracking-widest" htmlFor="password">Password</label>
                {mode === 'signin' && (
                  <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                )}
              </div>
              <motion.div 
                animate={{ 
                  boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(99,102,241,0.3)' : '0 0 0 1px rgba(255,255,255,0.1)'
                }}
                className="relative rounded-2xl bg-white/5 border border-white/10"
              >
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-transparent text-sm font-medium text-white placeholder-slate-500 focus:outline-none transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </motion.div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-400">Remember me</label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/20 border border-red-500/30"
              >
                <p className="text-red-400 text-sm font-medium">{error}</p>
                {error === 'Email already registered' && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await fetch(`${API_URL}/user`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: formData.email })
                        });
                        setError('Account deleted. Please try again.');
                      } catch (err) {
                        setError('Failed to delete account');
                      }
                    }}
                    className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Delete my account and try again
                  </button>
                )}
              </motion.div>
            )}

            <motion.button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 relative overflow-hidden group disabled:opacity-70"
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div 
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </motion.div>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Button shine effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-transparent px-4 text-slate-500">Or continue with</span>
              </div>
            </div>

            <motion.button 
              type="button"
              className="w-full h-14 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold text-sm transition-all group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Chrome className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              Continue with Google
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-400">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button 
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors ml-1.5"
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-xs text-slate-500"
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </div>
    </div>
  );
}