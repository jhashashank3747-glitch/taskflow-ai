import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: '#0F172A' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#6366F1' }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white font-semibold text-lg">TaskFlow AI</span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#1E293B' }}>
          <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
          <p style={{ color: '#94A3B8' }} className="mb-8 text-sm">
            Start managing tasks with your team
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
                Full name
              </label>
              <input
                type="text"
                placeholder="Shashank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none"
                style={{ background: '#0F172A', border: '1px solid #334155' }}
              />
            </div>
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
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none"
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
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none"
                style={{ background: '#0F172A', border: '1px solid #334155' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition mt-2"
              style={{ background: loading ? '#4338CA' : '#6366F1' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366F1' }} className="font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;