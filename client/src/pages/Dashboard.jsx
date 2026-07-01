import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data);
    } catch (err) {
      setError('Failed to load workspaces');
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      await api.post('/workspaces', { name: newWorkspaceName });
      setNewWorkspaceName('');
      setShowInput(false);
      fetchWorkspaces();
    } catch (err) {
      setError('Failed to create workspace');
    }
  };

  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

  return (
    <div className="min-h-screen flex" style={{ background: '#0F172A' }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col p-6 gap-6"
        style={{ background: '#1E293B', borderRight: '1px solid #334155' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#6366F1' }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-white font-semibold">TaskFlow AI</span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#475569' }}>
            Workspaces
          </p>
          <div className="flex flex-col gap-1">
            {workspaces.map((ws, i) => (
              <button
                key={ws._id}
                onClick={() => navigate(`/workspace/${ws._id}`)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition w-full"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0F172A'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: colors[i % colors.length] }}>
                  {ws.name[0].toUpperCase()}
                </div>
                <span className="truncate">{ws.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{ background: '#0F172A' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: '#6366F1' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#475569' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 px-3 py-2 rounded-lg text-sm transition"
            style={{ color: '#64748B' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Good to see you, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#64748B' }}>
                {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition"
              style={{ background: '#6366F1' }}
            >
              + New Workspace
            </button>
          </div>

          {showInput && (
            <form onSubmit={handleCreateWorkspace}
              className="flex gap-2 mb-6 p-4 rounded-xl"
              style={{ background: '#1E293B' }}>
              <input
                type="text"
                placeholder="Workspace name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                autoFocus
                className="flex-1 rounded-lg px-4 py-2 text-sm text-white outline-none"
                style={{ background: '#0F172A', border: '1px solid #334155' }}
              />
              <button type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#6366F1' }}>
                Create
              </button>
              <button type="button" onClick={() => setShowInput(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ color: '#64748B' }}>
                Cancel
              </button>
            </form>
          )}

          {error && (
            <p className="text-sm mb-4" style={{ color: '#FCA5A5' }}>{error}</p>
          )}

          {workspaces.length === 0 ? (
            <div className="text-center py-20 rounded-2xl"
              style={{ border: '2px dashed #1E293B' }}>
              <div className="text-4xl mb-4">🗂️</div>
              <p className="text-white font-medium mb-2">No workspaces yet</p>
              <p className="text-sm mb-4" style={{ color: '#475569' }}>
                Create your first workspace to get started
              </p>
              <button onClick={() => setShowInput(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#6366F1' }}>
                Create Workspace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws, i) => (
  <div
    key={ws._id}
    className="rounded-xl p-6 cursor-pointer transition relative group"
    style={{ background: '#1E293B', border: '1px solid #334155' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
  >
    <div onClick={() => navigate(`/workspace/${ws._id}`)}>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mb-4"
        style={{ background: colors[i % colors.length] }}
      >
        {ws.name[0].toUpperCase()}
      </div>
      <h3 className="font-semibold text-white mb-1">{ws.name}</h3>
      <p className="text-xs" style={{ color: '#475569' }}>
        {ws.members?.length || 0} member{ws.members?.length !== 1 ? 's' : ''}
      </p>
    </div>

    {/* Delete button */}
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${ws.name}"? This will also delete all its boards.`)) {
          try {
            await api.delete(`/workspaces/${ws._id}`);
            fetchWorkspaces();
          } catch (err) {
            alert('Failed to delete workspace');
          }
        }
      }}
      className="absolute top-3 right-3 w-7 h-7 rounded-full items-center justify-center text-white text-xs hidden group-hover:flex transition"
      style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.4)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
    >
      ✕
    </button>
  </div>
))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;