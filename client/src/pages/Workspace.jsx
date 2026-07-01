import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
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
      fetchBoards();
    } catch (err) {
      setError('Failed to create board');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-blue-600 mb-6 inline-block hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {workspace?.name || 'Workspace'}
      </h1>

      <form onSubmit={handleCreateBoard} className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="New board title"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          className="border rounded px-3 py-2 flex-1 max-w-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Board
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {boards.map((board) => (
          <div
            key={board._id}
            onClick={() => navigate(`/board/${board._id}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg text-gray-800">{board.title}</h3>
          </div>
        ))}
      </div>

      {boards.length === 0 && (
        <p className="text-gray-500">No boards yet — create one above.</p>
      )}
    </div>
  );
}

export default Workspace;