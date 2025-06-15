import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../icons/icon';
import { isTouchDevice } from './utils';

export default function SortableLesson({ lesson, moduleId, activeId, onDelete, onNavigate }) {
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
    activationConstraint: isMobile
      ? {
          delay: 200,
          tolerance: 5,
        }
      : undefined,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    userSelect: 'none',
    cursor: isDragging ? 'grabbing' : isMobile ? 'grab' : 'default',
    zIndex: isDragging ? 50 : 'auto',
    touchAction: 'none',
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <li
      ref={setNodeRef}
      className={`p-2 my-1 bg-white-100 border rounded shadow-sm flex items-center gap-2 justify-between ${
        isDragging || activeId === lesson.id ? 'bg-yellow-100' : ''
      }`}
      style={style}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${isMobile ? 'touch-manipulation' : ''}`}
          tabIndex={0}
          aria-label="Drag handle"
          style={isMobile ? { touchAction: 'none', fontSize: 24 } : {}}
        >
          <Icon type="drag" className="text-gray-400" />
        </span>
        <button
          className="text-left truncate flex-1 hover:underline"
          onClick={() => onNavigate(lesson.id)}
          style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
        >
          {lesson.title}
        </button>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="p-1 bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white-100"
          onClick={() => setDropdownOpen((open) => !open)}
          title="Options"
        >
          <Icon type="more" className="size-4" />
        </button>
        {dropdownOpen && (
          <ul className="absolute right-0 mt-2 w-32 bg-white-100 border rounded shadow-lg z-50">
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  // onEdit(moduleId, lesson.id);
                }}
              >
                Edit
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => {
                  setDropdownOpen(false);
                  onDelete(moduleId, lesson.id);
                }}
              >
                Hapus
              </button>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
}
