import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import api from '../services/api';
import socket from '../services/socket';
import SortableList from '../components/SortableList';

function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitles, setNewCardTitles] = useState({});
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

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
      const listsWithCards = await Promise.all(
        listsRes.data.map(async (list) => {
          const cardsRes = await api.get(`/cards/list/${list._id}`);
          return { ...list, cards: cardsRes.data };
        })
      );
      setLists(listsWithCards);
    } catch (err) {
      setError('Failed to load lists');
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/${id}`);
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to load activities');
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchListsAndCards();
    fetchActivities();

    socket.connect();
    socket.emit('join_board', id);

    socket.on('card_moved', ({ cardId, newListId, position }) => {
      setLists((prev) => {
        const sourceList = prev.find((l) =>
          l.cards.some((c) => c._id === cardId)
        );
        if (!sourceList) return prev;
        const card = sourceList.cards.find((c) => c._id === cardId);
        const updatedCard = { ...card, list: newListId, position };

        return prev.map((l) => {
          if (l._id === sourceList._id) {
            return { ...l, cards: l.cards.filter((c) => c._id !== cardId) };
          }
          if (l._id === newListId) {
            return { ...l, cards: [...l.cards, updatedCard] };
          }
          return l;
        });
      });
    });

    socket.on('card_created', (card) => {
      setLists((prev) =>
        prev.map((l) =>
          l._id === card.list ? { ...l, cards: [...l.cards, card] } : l
        )
      );
    });

    socket.on('list_created', (list) => {
      setLists((prev) => [...prev, { ...list, cards: [] }]);
    });

    return () => {
      socket.emit('leave_board', id);
      socket.off('card_moved');
      socket.off('card_created');
      socket.off('list_created');
      socket.disconnect();
    };
  }, [id]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      const res = await api.post('/lists', {
        title: newListTitle,
        boardId: id,
        position: lists.length,
      });
      setNewListTitle('');
      socket.emit('list_created', { boardId: id, list: res.data });
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
      const res = await api.post('/cards', {
        title,
        listId,
        boardId: id,
        position: list?.cards?.length || 0,
      });
      setNewCardTitles((prev) => ({ ...prev, [listId]: '' }));
      socket.emit('card_created', { boardId: id, card: res.data });
      fetchListsAndCards();
      fetchActivities();
    } catch (err) {
      setError('Failed to create card');
    }
  };

  const handleSubtasksCreated = (listId, subtasks) => {
    setLists((prev) =>
      prev.map((l) =>
        l._id === listId ? { ...l, cards: [...l.cards, ...subtasks] } : l
      )
    );
    fetchActivities();
  };

  const findListByCardId = (cardId) => {
    return lists.find((list) => list.cards.some((card) => card._id === cardId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeList = findListByCardId(activeId);
    const overList =
      findListByCardId(overId) || lists.find((l) => l._id === overId);

    if (!activeList || !overList) return;

    if (activeList._id === overList._id) {
      const oldIndex = activeList.cards.findIndex((c) => c._id === activeId);
      const newIndex = activeList.cards.findIndex((c) => c._id === overId);
      const reordered = arrayMove(activeList.cards, oldIndex, newIndex);

      setLists((prev) =>
        prev.map((l) =>
          l._id === activeList._id ? { ...l, cards: reordered } : l
        )
      );

      await Promise.all(
        reordered.map((card, index) =>
          api.put(`/cards/${card._id}`, { position: index })
        )
      );

      socket.emit('card_moved', {
        boardId: id,
        cardId: activeId,
        newListId: activeList._id,
        position: newIndex,
      });
    } else {
      const card = activeList.cards.find((c) => c._id === activeId);
      const newActiveCards = activeList.cards.filter((c) => c._id !== activeId);
      const newOverCards = [...overList.cards, { ...card, list: overList._id }];

      setLists((prev) =>
        prev.map((l) => {
          if (l._id === activeList._id) return { ...l, cards: newActiveCards };
          if (l._id === overList._id) return { ...l, cards: newOverCards };
          return l;
        })
      );

      await api.put(`/cards/${activeId}`, {
        list: overList._id,
        position: newOverCards.length - 1,
      });

      socket.emit('card_moved', {
        boardId: id,
        cardId: activeId,
        newListId: overList._id,
        position: newOverCards.length - 1,
      });
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists.map((list) => (
            <SortableList
              key={list._id}
              list={list}
              newCardTitle={newCardTitles[list._id]}
              onCardTitleChange={(listId, val) =>
                setNewCardTitles((prev) => ({ ...prev, [listId]: val }))
              }
              onAddCard={handleCreateCard}
              onSubtasksCreated={handleSubtasksCreated}
            />
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
      </DndContext>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Activity</h2>
        <div className="bg-white rounded-lg shadow p-4 max-w-md">
          {activities.length === 0 && (
            <p className="text-gray-400 text-sm">No activity yet.</p>
          )}
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="text-sm text-gray-600 py-2 border-b last:border-0"
            >
              <span className="font-medium text-gray-800">
                {activity.user?.name}
              </span>{' '}
              {activity.action}
              <span className="text-gray-400 text-xs ml-2">
                {new Date(activity.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Board;