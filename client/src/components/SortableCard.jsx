import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';

function SortableCard({ card, onSubtasksCreated, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleBreakdown = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await api.post(`/ai/breakdown/${card._id}`);
      onSubtasksCreated(res.data.subtasks);
    } catch (err) {
      alert('AI breakdown failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/cards/${card._id}`);
      onDelete(card._id);
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, background: '#1E293B', border: '1px solid #334155' }}
      {...attributes}
      {...listeners}
      className="rounded-lg p-3 cursor-grab group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-white flex-1">{card.title}</p>
        {showActions && (
          <button
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs px-1.5 py-0.5 rounded transition flex-shrink-0"
            style={{ color: '#64748B', background: '#0F172A' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
          >
            ✕
          </button>
        )}
      </div>

      {card.parentCard && (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: '#1E3A5F', color: '#60A5FA' }}>
          subtask
        </span>
      )}
      {!card.parentCard && (
        <button
          onClick={handleBreakdown}
          onPointerDown={(e) => e.stopPropagation()}
          disabled={loading}
          className="mt-2 text-xs px-2 py-1 rounded-md transition w-full text-left"
          style={{
            background: loading ? '#2D1B69' : '#1E1B4B',
            color: loading ? '#818CF8' : '#A5B4FC',
          }}
        >
          {loading ? '⏳ Thinking...' : '✨ AI Breakdown'}
        </button>
      )}
    </div>
  );
}

export default SortableCard;