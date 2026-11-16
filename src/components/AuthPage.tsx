import { useState, type FormEvent } from 'react';
import { GraduationCap, Lock, Mail, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth, type UserRole } from '@/lib/auth';
import { SCHOOL_NAME } from '@/lib/noticeText';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    if (mode === 'signin') {
      const { error: err } = await signIn(email.trim(), password);
      if (err) setError(err);
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setBusy(false);
        return;
      }
      const { error: err } = await signUp(email.trim(), password, fullName.trim(), role);
      if (err) setError(err);
      else {
        setError('');
        setMode('signin');
        setEmail('');
        setPassword('');
        setFullName('');
      }
    }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark"><GraduationCap size={28} strokeWidth={2} /></div>
          <h1>{SCHOOL_NAME}</h1>
          <p>School management portal</p>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); }}>
            Sign in
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && (
            <label className="auth-field">
              <span>Full name</span>
              <div className="auth-input-wrap">
                <UserIcon size={17} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </div>
            </label>
          )}

          <label className="auth-field">
            <span>Email address</span>
            <div className="auth-input-wrap">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <Lock size={17} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>
          </label>

          {mode === 'signup' && (
            <label className="auth-field">
              <span>Account type</span>
              <div className="auth-input-wrap">
                <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <option value="admin">Administrator — full access including user management</option>
                  <option value="teacher">Teacher — manage students, attendance, and notices</option>
                  <option value="parent">Parent — view your children's records and attendance</option>
                </select>
              </div>
            </label>
          )}

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? <Loader2 size={18} className="auth-spinner" /> : null}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          {mode === 'signin'
            ? 'New to the portal? Ask an administrator to create your account, or '
            : 'Already have an account? '}
          <button
            className="auth-switch"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          >
            {mode === 'signin' ? 'create one now' : 'sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
}
