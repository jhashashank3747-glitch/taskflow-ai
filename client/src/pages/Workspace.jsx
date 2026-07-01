import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');

  const fetchWorkspace = async () => {
    try {
      const res = await api.get(`/workspaces/${id}`);
      setWorkspace(res.data);
    } catch (err) {
      setError('Failed to load workspace');
    }
  };

  const fetchBoards = async () => {
    try {
      const res = await api.get(`/boards/workspace/${id}`);
      setBoards(res.data);
    } catch (err) {
      setError('Failed to load boards');
    }
  };

  useEffect(() => {
    fetchWorkspace();
    fetchBoards();
  }, [id]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      await api.post('/boards', { title: newBoardTitle, workspaceId: id });
      setNewBoardTitle('');
      setShowInput(false);
      fetchBoards();
    } catch (err) {
      setError('Failed to create board');
    }
  };

  const boardColors = [
    'linear-gradient(135deg, #6366F1, #8B5CF6)',
    'linear-gradient(135deg, #3B82F6, #6366F1)',
    'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'linear-gradient(135deg, #F59E0B, #EC4899)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #8B5CF6, #EC4899)',
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0F172A' }}>
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between"
        style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')}
            className="text-sm transition flex items-center gap-1"
            style={{ color: '#64748B' }}
            onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
            ← Dashboard
          </button>
          <span style={{ color: '#334155' }}>/</span>
          <h1 className="text-white font-semibold">{workspace?.name || 'Workspace'}</h1>
        </div>
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#6366F1' }}>
          + New Board
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {showInput && (
          <form onSubmit={handleCreateBoard}
            className="flex gap-2 mb-6 p-4 rounded-xl"
            style={{ background: '#1E293B' }}>
            <input
              type="text"
              placeholder="Board title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
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

        {error && <p className="text-sm mb-4" style={{ color: '#FCA5A5' }}>{error}</p>}

        {boards.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ border: '2px dashed #1E293B' }}>
            <div className="text-4xl mb-4">📋</div>
            <p className="text-white font-medium mb-2">No boards yet</p>
            <p className="text-sm mb-4" style={{ color: '#475569' }}>
              Create your first board to start organizing tasks
            </p>
            <button onClick={() => setShowInput(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: '#6366F1' }}>
              Create Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board, i) => (
  <div
    key={board._id}
    className="rounded-xl p-6 cursor-pointer transition relative overflow-hidden group"
    style={{
      background: boardColors[i % boardColors.length],
      minHeight: '120px',
    }}
  >
    <div onClick={() => navigate(`/board/${board._id}`)}>
      <h3 className="font-semibold text-white text-lg">{board.title}</h3>
      <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
        Click to open →
      </p>
    </div>
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${board.title}"?`)) {
          try {
            await api.delete(`/boards/${board._id}`);
            fetchBoards();
          } catch (err) {
            alert('Failed to delete board');
          }
        }
      }}
      className="absolute top-3 right-3 w-7 h-7 rounded-full items-center justify-center text-white text-xs hidden group-hover:flex transition"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      ✕
    </button>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workspace;