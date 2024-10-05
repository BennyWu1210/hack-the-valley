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
    padding: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    margin: '0 0 8px 0',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="flex flex-row justify-between align-center w-full items-center">
        <div>
          {id}
        </div>
        <div>

        <img src="/images/SelectBar.svg" alt="grip" style={{ width: '20px', height: '20px' }} />
        </div>

      </div>
    </li>
  );
};

export default DraggableList;
