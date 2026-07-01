import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';

function SortableCard({ card, onSubtasksCreated }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id });

  const [loading, setLoading] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border rounded p-2 text-sm text-gray-700 cursor-grab shadow-sm hover:shadow-md"
    >
      <p>{card.title}</p>
      {!card.parentCard && (
  <button
    onClick={handleBreakdown}
    onPointerDown={(e) => e.stopPropagation()}
    disabled={loading}
    className="mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 cursor-pointer"
  >
    {loading ? 'Thinking...' : '✨ AI Breakdown'}
  </button>
)}
    </div>
  );
}

export default SortableCard;