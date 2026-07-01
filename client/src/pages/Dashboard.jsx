import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
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
      fetchWorkspaces();
    } catch (err) {
      setError('Failed to create workspace');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || 'User'}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleCreateWorkspace} className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="New workspace name"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          className="border rounded px-3 py-2 flex-1 max-w-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Workspace
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {workspaces.map((ws) => (
          <div
            key={ws._id}
            onClick={() => navigate(`/workspace/${ws._id}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg text-gray-800">{ws.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {ws.members?.length || 0} member(s)
            </p>
          </div>
        ))}
      </div>

      {workspaces.length === 0 && (
        <p className="text-gray-500">No workspaces yet — create one above.</p>
      )}
    </div>
  );
}

export default Dashboard;