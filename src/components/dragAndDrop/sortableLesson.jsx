import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../icons/icon';
import LessonDropdown from './lessonDropdown';
import { isTouchDevice } from './utils';

export default function SortableLesson({
  lesson,
  moduleId,
  activeId,
  onDelete,
  onEdit,
  onNavigate,
  editable = true,
}) {
  const isMobile = isTouchDevice();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
    activationConstraint: isMobile ? { delay: 200, tolerance: 5 } : undefined,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    userSelect: 'none',
    cursor: isDragging ? 'grabbing' : 'default',
    zIndex: isDragging ? 50 : 'auto',
    touchAction: isMobile ? 'auto' : 'none',
  };

  const badgeStyle =
    lesson.type === 'material'
      ? 'border-blue-700 text-blue-700 bg-blue-50'
      : 'border-yellow-500 text-yellow-700 bg-yellow-50';

  return (
    <li
      ref={setNodeRef}
      className={`p-2 sm:p-2 my-1 bg-white border rounded shadow-sm flex items-center gap-2 justify-between ${
        isDragging || activeId === lesson.id ? 'bg-yellow-100' : ''
      } ${isMobile ? 'min-h-[56px]' : ''}`}
      style={style}
    >
      {/* Left: drag + info */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {editable && (
          <span
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 bg-gray-100 rounded-md"
            style={{ touchAction: isMobile ? 'none' : 'auto' }}
            aria-label="Drag handle"
          >
            <Icon type="drag" className="text-gray-400" />
          </span>
        )}
        <div className="flex flex-col md:flex-row gap-1">
          <span className={`w-fit px-2 py-1 border rounded-md text-xs sm:text-sm ${badgeStyle}`}>
            {lesson.type === 'material' ? 'Materi' : 'Quiz'}
          </span>

          <button
            className={`text-left flex-1 hover:underline text-xs sm:text-base ${
              isMobile ? 'text-sm' : ''
            }`}
            onClick={() => onNavigate(lesson.id)}
          >
            <span className="block break-words">{lesson.title}</span>
          </button>
        </div>
      </div>

      {/* Right: dropdown */}
      {editable && (
        <LessonDropdown
          isMobile={isMobile}
          onEdit={() => onEdit(moduleId, lesson.id)}
          onDelete={() => onDelete(moduleId, lesson.id)}
        />
      )}
    </li>
  );
}
