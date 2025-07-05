import React, { useRef, useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../icons/icon';
import { isTouchDevice } from './utils';

function DropdownMenu({ isMobile, onEdit, onDelete, editable }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white-100"
        onClick={() => setOpen((o) => !o)}
        title="Options"
      >
        <Icon type="more" className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-36 sm:w-32 bg-white-100 border rounded shadow-lg z-50 text-xs sm:text-sm">
          <li>
            <button
              className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              style={{ fontSize: isMobile ? 16 : undefined }}
              onClick={() => {
                setOpen(false);
                onEdit?.();
              }}
            >
              Edit
            </button>
          </li>
          <li>
            <button
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500"
              style={{ fontSize: isMobile ? 16 : undefined }}
              onClick={() => {
                setOpen(false);
                onDelete?.();
              }}
            >
              Hapus
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default function SortableModule({
  id,
  module,
  children,
  isOver,
  onAddLesson,
  onDeleteModule,
  onEditModule,
  editable = true,
}) {
  const isMobile = isTouchDevice();

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
    activationConstraint: isMobile ? { delay: 200, tolerance: 5 } : undefined,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    userSelect: 'none',
    marginBottom: isMobile ? '0.75rem' : '1rem',
    touchAction: isMobile ? 'auto' : 'none',
    padding: isMobile ? '10px 6px' : undefined,
  };

  const titleBlock = (
    <h2 className="text-base sm:text-lg font-semibold break-words w-full mb-2" title={module.title}>
      {module.title}
    </h2>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white-100 p-2 sm:p-4 rounded shadow border-2 transition-colors relative ${
        isOver ? 'border-primary-400 bg-primary-50' : 'border-transparent'
      }`}
      tabIndex={0}
      aria-label="Drag module"
    >
      {/* Header */}
      <div className="w-full flex items-start justify-between sm:gap-4 mb-2">
        {/* Left: Drag + Title */}
        <div className="flex w-full items-start gap-2 sm:gap-3">
          {editable && (
            <span
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              tabIndex={0}
              aria-label="Drag handle"
              className={`${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              } active:cursor-grabbing flex-shrink-0 p-1 bg-gray-100 rounded-md`}
              style={{ touchAction: isMobile ? 'none' : undefined }}
            >
              <Icon type="drag" className="text-gray-400" />
            </span>
          )}
          {!isMobile && titleBlock}
        </div>

        {/* Right: Actions */}
        {editable && (
          <div className="flex gap-2 items-center justify-end">
            <button
              className={`bg-tertiary-500 rounded-md p-2 text-white-100 hover:bg-tertiary-700 text-xs sm:text-sm flex items-center gap-1 ${
                isMobile ? 'text-base' : ''
              }`}
              onClick={() => onAddLesson(module.id)}
              title="Tambah Lesson"
            >
              <Icon type="plus" className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
              <span className="hidden md:inline">Pembelajaran</span>
            </button>
            <DropdownMenu
              isMobile={isMobile}
              onEdit={() => onEditModule?.(module.id)}
              onDelete={() => onDeleteModule?.(module.id)}
            />
          </div>
        )}
      </div>

      {/* Mobile Title */}
      {isMobile && titleBlock}

      {/* Lessons */}
      <ul
        className={`min-h-[40px] sm:min-h-[50px] border p-2 rounded bg-gray-50 overflow-x-auto ${
          isMobile ? 'p-2' : ''
        }`}
      >
        {children}
      </ul>
    </div>
  );
}
