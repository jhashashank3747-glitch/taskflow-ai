import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import SortableCard from './SortableCard';
import api from '../services/api';

function SortableList({ list, newCardTitle, onCardTitleChange, onAddCard, onSubtasksCreated, onDeleteList, onDeleteCard }) {
  const { setNodeRef } = useDroppable({ id: list._id });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteList = async () => {
    try {
      await api.delete(`/lists/${list._id}`);
      onDeleteList(list._id);
    } catch (err) {
      alert('Failed to delete list');
    }
  };

  return (
    <div
      className="rounded-xl flex-shrink-0 flex flex-col"
      style={{
        background: '#1E293B',
        border: '1px solid #334155',
        minWidth: '272px',
        width: '272px',
        maxHeight: 'calc(100vh - 180px)',
      }}
    >
      {/* List header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #334155' }}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-white">{list.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#0F172A', color: '#64748B' }}>
            {list.cards?.length || 0}
          </span>
        </div>

        {/* Delete list button */}
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Sure?</span>
            <button
              onClick={handleDeleteList}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: '#450A0A', color: '#F87171' }}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: '#0F172A', color: '#64748B' }}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs px-2 py-1 rounded transition"
            style={{ color: '#475569' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#475569'}
          >
            ✕
          </button>
        )}
      </div>

      {/* Cards */}
      <SortableContext
        items={list.cards.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="flex flex-col gap-2 p-3 overflow-y-auto flex-1"
          style={{ minHeight: '40px' }}
        >
          {list.cards.map((card) => (
            <SortableCard
              key={card._id}
              card={card}
              onSubtasksCreated={(subtasks) => onSubtasksCreated(list._id, subtasks)}
              onDelete={(cardId) => onDeleteCard(list._id, cardId)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add card input */}
      <div className="p-3" style={{ borderTop: '1px solid #334155' }}>
        <input
          type="text"
          placeholder="Add a card..."
          value={newCardTitle || ''}
          onChange={(e) => onCardTitleChange(list._id, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddCard(list._id); }}
          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none mb-2"
          style={{ background: '#0F172A', border: '1px solid #334155' }}
        />
        <button
          onClick={() => onAddCard(list._id)}
          className="w-full py-2 rounded-lg text-xs font-medium transition"
          style={{ background: '#6366F1', color: 'white' }}
        >
          + Add Card
        </button>
      </div>
    </div>
  );
}

export default SortableList;