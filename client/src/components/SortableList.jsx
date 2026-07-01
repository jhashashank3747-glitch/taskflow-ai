import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import SortableCard from './SortableCard';

function SortableList({ list, newCardTitle, onCardTitleChange, onAddCard }) {
  const { setNodeRef } = useDroppable({ id: list._id });

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-w-64 w-64 flex-shrink-0">
      <h3 className="font-semibold text-gray-700 mb-3">{list.title}</h3>

      <SortableContext
        items={list.cards.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-2 min-h-8 mb-3">
          {list.cards.map((card) => (
            <SortableCard key={card._id} card={card} />
          ))}
        </div>
      </SortableContext>

      <input
        type="text"
        placeholder="Add a card..."
        value={newCardTitle || ''}
        onChange={(e) => onCardTitleChange(list._id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAddCard(list._id);
        }}
        className="w-full border rounded px-2 py-1 text-sm mb-2 bg-white"
      />
      <button
        onClick={() => onAddCard(list._id)}
        className="w-full bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600"
      >
        + Add Card
      </button>
    </div>
  );
}

export default SortableList;