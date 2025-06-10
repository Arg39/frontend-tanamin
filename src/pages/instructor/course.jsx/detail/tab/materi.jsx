import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../../../../components/icons/icon';
import { useNavigate } from 'react-router-dom';

// Data awal
const initialData = [
  {
    id: 'outline-1',
    title:
      'Module 1: Introduction to Freelance Design Career Introduction to Freelance Design Career',
    materials: [
      {
        id: 'materi-1',
        title: 'Apa itu Freelance UI/UX & Illustrator Apa itu Freelance UI/UX & Illustrator',
      },
      { id: 'materi-2', title: 'Skillset yang Dibutuhkan' },
    ],
  },
  {
    id: 'outline-2',
    title: 'Komponen di React',
    materials: [
      { id: 'materi-3', title: 'Membuat Komponen' },
      { id: 'materi-4', title: 'Props dan State' },
    ],
  },
  {
    id: 'outline-3',
    title: 'State Management',
    materials: [],
  },
];

function isTouchDevice() {
  return (
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

// Draggable & Sortable Material Item
function SortableMaterial({ materi, outlineId, activeId, onDelete, onNavigate }) {
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
    id: materi.id,
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

  return (
    <li
      ref={setNodeRef}
      className={`p-2 my-1 bg-white-100 border rounded shadow-sm flex items-center gap-2 justify-between ${
        isDragging || activeId === materi.id ? 'bg-yellow-100' : ''
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
          onClick={() => onNavigate(materi.id)}
          style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
        >
          {materi.title}
        </button>
      </div>
      <button
        className="ml-2 text-red-500 hover:text-red-700"
        title="Hapus Materi"
        onClick={() => onDelete(outlineId, materi.id)}
        tabIndex={0}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <Icon type="trash" />
      </button>
    </li>
  );
}

// Droppable Outline
function DroppableOutline({ outline, children, isOver, onAddMateri, onDeleteOutline }) {
  return (
    <div
      className={`bg-white-100 p-4 rounded shadow border-2 transition-colors relative ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{outline.title}</h2>
        <div className="flex gap-2 w-fit">
          <button
            className="border border-primary-700 rounded-md p-2 text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
            onClick={() => onAddMateri(outline.id)}
            title="Tambah Materi"
          >
            <Icon type="plus" />
            <span className="hidden md:inline">Materi</span>
          </button>
          <button
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            onClick={() => onDeleteOutline(outline.id)}
            title="Hapus Outline"
          >
            <Icon type="trash" />
          </button>
        </div>
      </div>
      <ul className="min-h-[50px] border p-2 rounded bg-gray-50">{children}</ul>
    </div>
  );
}

function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function OutlineMateriList() {
  const [outlines, setOutlines] = useState(initialData);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const navigate = useNavigate();

  // Find outline and material by materialId
  const findMaterialLocation = (materialId) => {
    for (let outlineIdx = 0; outlineIdx < outlines.length; outlineIdx++) {
      const matIdx = outlines[outlineIdx].materials.findIndex((m) => m.id === materialId);
      if (matIdx !== -1) {
        return { outlineIdx, matIdx };
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const from = findMaterialLocation(active.id);

    // Find which outline is being hovered
    let toOutlineIdx = outlines.findIndex((o) => o.id === over.id);
    let toMatIdx = -1;

    // If hovering over a material, get its outline and index
    if (toOutlineIdx === -1) {
      for (let i = 0; i < outlines.length; i++) {
        const idx = outlines[i].materials.findIndex((m) => m.id === over.id);
        if (idx !== -1) {
          toOutlineIdx = i;
          toMatIdx = idx;
          break;
        }
      }
    }

    if (!from || toOutlineIdx === -1) return;

    // If dropped in the same outline and same position, do nothing
    if (from.outlineIdx === toOutlineIdx && (toMatIdx === -1 || from.matIdx === toMatIdx)) {
      return;
    }

    // Remove from old outline
    const material = outlines[from.outlineIdx].materials[from.matIdx];
    let newOutlines = outlines.map((outline, idx) => {
      if (idx === from.outlineIdx) {
        return {
          ...outline,
          materials: outline.materials.filter((m) => m.id !== active.id),
        };
      }
      return outline;
    });

    // Insert into new outline at correct position
    let newMaterials;
    if (toMatIdx === -1) {
      // Dropped on outline itself, add to end
      newMaterials = [...newOutlines[toOutlineIdx].materials, material];
    } else {
      // Dropped on a material, insert before it
      newMaterials = [...newOutlines[toOutlineIdx].materials];
      newMaterials.splice(toMatIdx, 0, material);
    }

    newOutlines[toOutlineIdx] = {
      ...newOutlines[toOutlineIdx],
      materials: newMaterials,
    };

    setOutlines(newOutlines);
  };

  // For DragOverlay
  const activeMaterial = (() => {
    if (!activeId) return null;
    for (const outline of outlines) {
      const materi = outline.materials.find((m) => m.id === activeId);
      if (materi) return materi;
    }
    return null;
  })();

  // Handler: Tambah Outline
  const handleAddOutline = () => {
    const newOutline = {
      id: generateId('outline'),
      title: 'Outline Baru',
      materials: [],
    };
    setOutlines([...outlines, newOutline]);
  };

  // Handler: Hapus Outline
  const handleDeleteOutline = (outlineId) => {
    setOutlines(outlines.filter((o) => o.id !== outlineId));
  };

  // Handler: Tambah Materi
  const handleAddMateri = (outlineId) => {
    setOutlines((prev) =>
      prev.map((outline) =>
        outline.id === outlineId
          ? {
              ...outline,
              materials: [
                ...outline.materials,
                {
                  id: generateId('materi'),
                  title: 'Materi Baru',
                },
              ],
            }
          : outline
      )
    );
  };

  // Handler: Hapus Materi
  const handleDeleteMateri = (outlineId, materiId) => {
    setOutlines((prev) =>
      prev.map((outline) =>
        outline.id === outlineId
          ? {
              ...outline,
              materials: outline.materials.filter((m) => m.id !== materiId),
            }
          : outline
      )
    );
  };

  // Handler: Navigasi ke detail materi
  const handleNavigateMateri = (materiId) => {
    navigate(`/instructor/course/materi/${materiId}`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Daftar Outline & Materi</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
        onClick={handleAddOutline}
      >
        <Icon type="plus" /> Tambah Outline
      </button>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {outlines.map((outline) => (
            <DroppableOutline
              key={outline.id}
              outline={outline}
              isOver={overId === outline.id}
              onAddMateri={handleAddMateri}
              onDeleteOutline={handleDeleteOutline}
            >
              <SortableContext
                items={outline.materials.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                {outline.materials.length === 0 && (
                  <li className="text-sm text-gray-400 italic">(Belum ada materi)</li>
                )}
                {outline.materials.map((materi) => (
                  <SortableMaterial
                    key={materi.id}
                    materi={materi}
                    outlineId={outline.id}
                    activeId={activeId}
                    onDelete={handleDeleteMateri}
                    onNavigate={handleNavigateMateri}
                  />
                ))}
              </SortableContext>
            </DroppableOutline>
          ))}
        </div>
        <DragOverlay>
          {activeMaterial ? (
            <li className="p-2 my-1 bg-yellow-100 border rounded shadow flex items-center gap-2">
              <span>
                <Icon type="drag" className="text-gray-400" />
              </span>
              {activeMaterial.title}
            </li>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
