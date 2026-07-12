import React from 'react';
import { Mail, Lock, User, ArrowRight, X, Terminal } from 'lucide-react';
import toast from '../utils/toast.js';
import { authService } from '../services/index.js';

export default function AuthModal({ isOpen, mode, onClose, onSuccess, setMode }) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const res = await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        toast.success("Account created successfully!");
        onSuccess(res.data);
      } else {
        const res = await authService.login(formData.email, formData.password);
        toast.success("Welcome back!");
        onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl shadow-violet-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-60 h-60 rounded-full bg-violet-600/20 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-60 h-60 rounded-full bg-indigo-600/20 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 p-8">
          <div className="flex items-center space-x-2 mb-6 justify-center">
            <Terminal className="h-6 w-6 text-violet-500" />
            <span className="font-sans font-black text-xl text-white tracking-tight">CodeForge</span>
          </div>

          <h2 className="text-center font-sans font-bold text-2xl text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-xs text-slate-400 mb-8">
            {mode === 'login' 
              ? 'Enter your credentials to access the workspace.' 
              : 'Join the elite engineering platform.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border border-white/5 focus:border-violet-500/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    placeholder="code_ninja"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border border-white/5 focus:border-violet-500/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border border-white/5 focus:border-violet-500/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border border-white/5 focus:border-violet-500/50 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-violet-400 hover:text-violet-300 font-bold hover:underline transition-all cursor-pointer"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
