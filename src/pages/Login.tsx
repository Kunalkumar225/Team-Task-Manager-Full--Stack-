import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff, CheckSquare, ArrowRight, Shield, Zap, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password, role });
      if (response.data.success) {
        login(response.data.data.token, response.data.data.user);
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: 'Real-time task tracking across projects' },
    { icon: Users, text: 'Collaborate with your entire team' },
    { icon: Shield, text: 'Role-based access & permissions' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[52%] auth-gradient flex-col justify-between p-12 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center animate-glow-pulse border border-white/20">
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            TaskFlow
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative animate-float">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 text-xs font-medium">Trusted by 10,000+ teams worldwide</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            Work smarter,<br />ship faster.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10 max-w-md">
            The all-in-one workspace for modern teams to plan, track, and deliver exceptional work.
          </p>

          {/* Feature bullets */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-indigo-200" />
                </div>
                <span className="text-indigo-100 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-indigo-300/60 text-xs relative">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white animate-fade-slide-up">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>TaskFlow</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sign in as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex flex-col items-start p-3 border rounded-xl text-left transition-all ${
                    role === 'ADMIN'
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm font-bold ${role === 'ADMIN' ? 'text-indigo-700' : 'text-slate-700'}`}>Admin</span>
                  <span className={`text-xs mt-0.5 ${role === 'ADMIN' ? 'text-indigo-600/80' : 'text-slate-500'}`}>Create & manage projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MEMBER')}
                  className={`flex flex-col items-start p-3 border rounded-xl text-left transition-all ${
                    role === 'MEMBER'
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm font-bold ${role === 'MEMBER' ? 'text-indigo-700' : 'text-slate-700'}`}>Member</span>
                  <span className={`text-xs mt-0.5 ${role === 'MEMBER' ? 'text-indigo-600/80' : 'text-slate-500'}`}>Join & complete tasks</span>
                </button>
              </div>

            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">New to TaskFlow?</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <Link
            to="/register"
            className="btn-secondary w-full py-2.5 text-sm"
          >
            Create a free account
          </Link>

          <p className="text-center text-xs text-slate-400 mt-6">
            By signing in, you agree to our{' '}
            <span className="text-indigo-500 cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
