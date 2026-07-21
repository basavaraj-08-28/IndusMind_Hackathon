import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { Shield, Key, Mail, Cpu } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('manager@indusmind.ai');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('Plant Manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await login(email, password, role);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials or backend connection issue.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (selRole: UserRole, selEmail: string) => {
    setRole(selRole);
    setEmail(selEmail);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl z-10 backdrop-blur-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/25 mb-3">
            IM
          </div>
          <h2 className="text-xl font-bold text-slate-100">Welcome to IndusMind AI</h2>
          <p className="text-xs text-slate-400 mt-1">Industrial Knowledge Intelligence Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Operational Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-850 rounded-lg text-slate-200 outline-none focus:border-indigo-500 appearance-none"
              >
                <option value="Plant Manager">Plant Manager</option>
                <option value="Maintenance Engineer">Maintenance Engineer</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Quality Engineer">Quality Engineer</option>
                <option value="Administrator">Administrator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-950 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="operator@indusmind.ai"
              />
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-950 border border-slate-850 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
              <Key className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/25 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Authenticate Secure Session'
            )}
          </button>
        </form>

        {/* Quick Sandbox Profiles */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Or Sign In With Sandbox Role Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => fillCredentials('Plant Manager', 'manager@indusmind.ai')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 text-left border border-slate-850 truncate"
            >
              Plant Manager
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('Maintenance Engineer', 'maint@indusmind.ai')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 text-left border border-slate-850 truncate"
            >
              Maint Engineer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('Safety Officer', 'safety@indusmind.ai')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 text-left border border-slate-850 truncate"
            >
              Safety Officer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('Quality Engineer', 'quality@indusmind.ai')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-slate-300 text-left border border-slate-850 truncate"
            >
              Quality Engineer
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an operator account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">Register Access</Link>
        </div>
      </div>
    </div>
  );
};
