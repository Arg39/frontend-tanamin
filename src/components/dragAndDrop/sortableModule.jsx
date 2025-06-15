import React, { useRef, useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../icons/icon';

export default function SortableModule({
  id,
  module,
  children,
  isOver,
  onAddLesson,
  onDeleteModule,
  onEditModule,
}) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    // cursor: isDragging ? 'grabbing' : 'grab', // Remove this line
    userSelect: 'none',
    marginBottom: '1rem',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white-100 p-4 rounded shadow border-2 transition-colors relative ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-transparent'
      }`}
      tabIndex={0}
      aria-label="Drag module"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            tabIndex={0}
            aria-label="Drag handle"
            className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} active:cursor-grabbing`}
            style={{ fontSize: 24 }}
          >
            <Icon type="drag" className="text-gray-400" />
          </span>
          <h2 className="text-lg font-semibold">{module.title}</h2>
        </div>
        <div className="flex gap-2 w-fit items-center">
          <button
            className="bg-tertiary-500 rounded-md p-2 text-white-100 hover:bg-tertiary-700 text-sm flex items-center gap-1"
            onClick={() => onAddLesson(module.id)}
            title="Tambah Lesson"
          >
            <Icon type="plus" className={'size-3'} />
            <span className="hidden md:inline">Materi</span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white-100"
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
                      if (onEditModule) onEditModule(module.id);
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
                      onDeleteModule(module.id);
                    }}
                  >
                    Hapus
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <ul className="min-h-[50px] border p-2 rounded bg-gray-50">{children}</ul>
    </div>
  );
}
