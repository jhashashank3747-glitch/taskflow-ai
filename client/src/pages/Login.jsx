import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0F172A' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#6366F1' }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white font-semibold text-lg">TaskFlow AI</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage tasks,<br />
            <span style={{ color: '#6366F1' }}>collaborate in real-time.</span>
          </h1>
          <p style={{ color: '#94A3B8' }} className="text-lg">
            AI-powered task breakdown, drag-and-drop boards, and live team sync — all in one place.
          </p>
        </div>
        <div className="flex gap-6">
          {['Real-time sync', 'AI breakdown', 'Team boards'].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} />
              <span style={{ color: '#94A3B8' }} className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8" style={{ background: '#1E293B' }}>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p style={{ color: '#94A3B8' }} className="mb-8 text-sm">
              Sign in to your workspace
            </p>

            {error && (
              <div className="rounded-lg px-4 py-3 mb-6 text-sm"
                style={{ background: '#450A0A', color: '#FCA5A5' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#94A3B8' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition"
                  style={{ background: '#0F172A', border: '1px solid #334155' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#94A3B8' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition"
                  style={{ background: '#0F172A', border: '1px solid #334155' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition mt-2"
                style={{ background: loading ? '#4338CA' : '#6366F1' }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-sm text-center" style={{ color: '#64748B' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#6366F1' }} className="font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;