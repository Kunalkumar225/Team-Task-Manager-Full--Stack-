import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff, CheckSquare, Info, Check, X, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', segments: [] as string[], rules: [] as any[], textColor: '' };
    const rules = [
      { label: 'At least 4 characters', pass: pass.length >= 4 },
      { label: 'Starts with capital', pass: /^[A-Z]/.test(pass) },
      { label: 'Contains lowercase', pass: /[a-z]/.test(pass) },
      { label: 'Contains a number', pass: /[0-9]/.test(pass) },
      { label: 'Max 12 characters', pass: pass.length <= 12 },
    ];
    const score = rules.filter((r) => r.pass).length;
    const colors = ['bg-rose-500', 'bg-orange-500', 'bg-amber-400', 'bg-lime-500', 'bg-emerald-500'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const textColors = ['text-rose-600', 'text-orange-600', 'text-amber-600', 'text-lime-600', 'text-emerald-600'];
    const segments = Array.from({ length: 5 }, (_, i) => (i < score ? colors[score - 1] : 'bg-slate-200'));
    return { score, label: labels[score - 1] || '', segments, rules, textColor: textColors[score - 1] || '' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data.success) {
        login(response.data.data.token, response.data.data.user);
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error: any) {
      const msgs = error.response?.data?.errors?.map((e: any) => e.msg).join(', ') || error.response?.data?.message || 'Registration failed';
      toast.error(msgs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[52%] auth-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/3 -left-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <CheckSquare size={22} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TaskFlow</span>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 text-xs font-medium">Join 10,000+ high-performing teams</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Start shipping<br />with your team.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
            Set up your workspace in seconds. No credit card required.
          </p>
        </div>
        <div className="text-indigo-300/60 text-xs relative">© {new Date().getFullYear()} TaskFlow.</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto animate-fade-slide-up">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg">TaskFlow</span>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Create your account</h2>
            <p className="text-slate-500 text-sm">Free forever. No credit card needed.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
              <input id="register-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work email</label>
              <input id="register-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Role</label>
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input id="register-password" type={showPassword ? 'text' : 'password'} required maxLength={12} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {password ? (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-2">
                    {strength.segments.map((color, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${color}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${strength.textColor}`}>{strength.label}</span>
                    <span className="text-xs text-slate-400">{password.length}/12</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {strength.rules.map((rule: any, i: number) => (
                      <div key={i} className="flex items-center gap-1.5">
                        {rule.pass ? <Check size={11} className="text-emerald-500 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0" />}
                        <span className={`text-xs ${rule.pass ? 'text-emerald-600' : 'text-slate-400'}`}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-400">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <p>4–12 characters, start with a capital letter, include a number.</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <input id="register-confirm-password" type={showConfirm ? 'text' : 'password'} required maxLength={12} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password"
                  className={`input-field pr-11 ${passwordsMismatch ? 'border-rose-400' : ''} ${passwordsMatch ? 'border-emerald-400' : ''}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" tabIndex={-1}>
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordsMismatch && <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1"><X size={12} /> Passwords do not match</p>}
              {passwordsMatch && <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1"><Check size={12} /> Passwords match</p>}
            </div>

            <button id="register-submit" type="submit" disabled={loading || passwordsMismatch} className="btn-primary w-full py-3 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create account</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <Link to="/login" className="btn-secondary w-full py-2.5 text-sm flex items-center justify-center">Sign in instead</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
