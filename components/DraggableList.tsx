import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableListProps {
  items: string[];
  setItems: (newOrder: string[]) => void;
}

const DraggableList: React.FC<DraggableListProps> = ({ items, setItems }) => {
  const sensors = useSensors(
    useSensor(PointerSensor), // For mouse or touch drag
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Keyboard navigation
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update the parent state by calling setItems
      setItems(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

interface SortableItemProps {
  id: string;
}

const SortableItem: React.FC<SortableItemProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    margin: '0 0 8px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </li>
  );
};

export default DraggableList;
