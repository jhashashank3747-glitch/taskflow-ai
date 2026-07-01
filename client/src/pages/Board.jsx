import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitles, setNewCardTitles] = useState({});
  const [error, setError] = useState('');

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/boards/${id}`);
      setBoard(res.data);
    } catch (err) {
      setError('Failed to load board');
    }
  };

  const fetchListsAndCards = async () => {
    try {
      const listsRes = await api.get(`/lists/board/${id}`);
      const listsData = listsRes.data;

      const listsWithCards = await Promise.all(
        listsData.map(async (list) => {
          const cardsRes = await api.get(`/cards/list/${list._id}`);
          return { ...list, cards: cardsRes.data };
        })
      );

      setLists(listsWithCards);
    } catch (err) {
      setError('Failed to load lists');
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchListsAndCards();
  }, [id]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      await api.post('/lists', {
        title: newListTitle,
        boardId: id,
        position: lists.length,
      });
      setNewListTitle('');
      fetchListsAndCards();
    } catch (err) {
      setError('Failed to create list');
    }
  };

  const handleCreateCard = async (listId) => {
    const title = newCardTitles[listId];
    if (!title?.trim()) return;
    try {
      const list = lists.find((l) => l._id === listId);
      await api.post('/cards', {
        title,
        listId,
        position: list?.cards?.length || 0,
      });
      setNewCardTitles((prev) => ({ ...prev, [listId]: '' }));
      fetchListsAndCards();
    } catch (err) {
      setError('Failed to create card');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-6 inline-block hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {board?.title || 'Board'}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div
            key={list._id}
            className="bg-white rounded-lg shadow p-4 min-w-64 w-64 flex-shrink-0"
          >
            <h3 className="font-semibold text-gray-700 mb-3">{list.title}</h3>

            <div className="flex flex-col gap-2 mb-3">
              {list.cards?.map((card) => (
                <div
                  key={card._id}
                  className="bg-gray-50 border rounded p-2 text-sm text-gray-700"
                >
                  {card.title}
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add a card..."
              value={newCardTitles[list._id] || ''}
              onChange={(e) =>
                setNewCardTitles((prev) => ({
                  ...prev,
                  [list._id]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCard(list._id);
              }}
              className="w-full border rounded px-2 py-1 text-sm mb-2"
            />
            <button
              onClick={() => handleCreateCard(list._id)}
              className="w-full bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600"
            >
              + Add Card
            </button>
          </div>
        ))}

        <div className="min-w-64 w-64 flex-shrink-0">
          <form onSubmit={handleCreateList}>
            <input
              type="text"
              placeholder="New list title"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              + Add List
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Board;