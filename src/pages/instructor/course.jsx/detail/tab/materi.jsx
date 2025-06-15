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
    id: 'module-1',
    title:
      'Module 1: Introduction to Freelance Design Career Introduction to Freelance Design Career',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Apa itu Freelance UI/UX & Illustrator Apa itu Freelance UI/UX & Illustrator',
      },
      { id: 'lesson-2', title: 'Skillset yang Dibutuhkan' },
    ],
  },
  {
    id: 'module-2',
    title: 'Komponen di React',
    lessons: [
      { id: 'lesson-3', title: 'Membuat Komponen' },
      { id: 'lesson-4', title: 'Props dan State' },
    ],
  },
  {
    id: 'module-3',
    title: 'State Management',
    lessons: [],
  },
];

function isTouchDevice() {
  return (
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

// Draggable & Sortable Lesson Item
function SortableLesson({ lesson, moduleId, activeId, onDelete, onNavigate }) {
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
      <button
        className="ml-2 text-red-500 hover:text-red-700"
        title="Hapus Lesson"
        onClick={() => onDelete(moduleId, lesson.id)}
        tabIndex={0}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <Icon type="trash" />
      </button>
    </li>
  );
}

// Droppable Module
function DroppableModule({ module, children, isOver, onAddLesson, onDeleteModule }) {
  return (
    <div
      className={`bg-white-100 p-4 rounded shadow border-2 transition-colors relative ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{module.title}</h2>
        <div className="flex gap-2 w-fit">
          <button
            className="border border-primary-700 rounded-md p-2 text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
            onClick={() => onAddLesson(module.id)}
            title="Tambah Lesson"
          >
            <Icon type="plus" />
            <span className="hidden md:inline">Lesson</span>
          </button>
          <button
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            onClick={() => onDeleteModule(module.id)}
            title="Hapus Modul"
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

export default function ModuleLessonList() {
  const [modules, setModules] = useState(initialData);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const navigate = useNavigate();

  // Find module and lesson by lessonId
  const findLessonLocation = (lessonId) => {
    for (let moduleIdx = 0; moduleIdx < modules.length; moduleIdx++) {
      const lesIdx = modules[moduleIdx].lessons.findIndex((l) => l.id === lessonId);
      if (lesIdx !== -1) {
        return { moduleIdx, lesIdx };
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

    const from = findLessonLocation(active.id);

    // Find which module is being hovered
    let toModuleIdx = modules.findIndex((m) => m.id === over.id);
    let toLesIdx = -1;

    // If hovering over a lesson, get its module and index
    if (toModuleIdx === -1) {
      for (let i = 0; i < modules.length; i++) {
        const idx = modules[i].lessons.findIndex((l) => l.id === over.id);
        if (idx !== -1) {
          toModuleIdx = i;
          toLesIdx = idx;
          break;
        }
      }
    }

    if (!from || toModuleIdx === -1) return;

    // If dropped in the same module and same position, do nothing
    if (from.moduleIdx === toModuleIdx && (toLesIdx === -1 || from.lesIdx === toLesIdx)) {
      return;
    }

    // Remove from old module
    const lesson = modules[from.moduleIdx].lessons[from.lesIdx];
    let newModules = modules.map((module, idx) => {
      if (idx === from.moduleIdx) {
        return {
          ...module,
          lessons: module.lessons.filter((l) => l.id !== active.id),
        };
      }
      return module;
    });

    // Insert into new module at correct position
    let newLessons;
    if (toLesIdx === -1) {
      // Dropped on module itself, add to end
      newLessons = [...newModules[toModuleIdx].lessons, lesson];
    } else {
      // Dropped on a lesson, insert before it
      newLessons = [...newModules[toModuleIdx].lessons];
      newLessons.splice(toLesIdx, 0, lesson);
    }

    newModules[toModuleIdx] = {
      ...newModules[toModuleIdx],
      lessons: newLessons,
    };

    setModules(newModules);
  };

  // For DragOverlay
  const activeLesson = (() => {
    if (!activeId) return null;
    for (const module of modules) {
      const lesson = module.lessons.find((l) => l.id === activeId);
      if (lesson) return lesson;
    }
    return null;
  })();

  // Handler: Tambah Modul
  const handleAddModule = () => {
    const newModule = {
      id: generateId('module'),
      title: 'Modul Baru',
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  // Handler: Hapus Modul
  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  // Handler: Tambah Lesson
  const handleAddLesson = (moduleId) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: generateId('lesson'),
                  title: 'Lesson Baru',
                },
              ],
            }
          : module
      )
    );
  };

  // Handler: Hapus Lesson
  const handleDeleteLesson = (moduleId, lessonId) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter((l) => l.id !== lessonId),
            }
          : module
      )
    );
  };

  // Handler: Navigasi ke detail lesson
  const handleNavigateLesson = (lessonId) => {
    navigate(`/instructor/course/lesson/${lessonId}`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Daftar Materi Kursus</h1>
        <button
          className="mb-4 px-4 py-2 bg-primary-700 text-white rounded hover:bg-primary-800 flex items-center gap-2 text-white-100"
          onClick={handleAddModule}
        >
          <Icon type="plus" /> Modul
        </button>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {modules.map((module) => (
            <DroppableModule
              key={module.id}
              module={module}
              isOver={overId === module.id}
              onAddLesson={handleAddLesson}
              onDeleteModule={handleDeleteModule}
            >
              <SortableContext
                items={module.lessons.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {module.lessons.length === 0 && (
                  <li className="text-sm text-gray-400 italic">(Belum ada lesson)</li>
                )}
                {module.lessons.map((lesson) => (
                  <SortableLesson
                    key={lesson.id}
                    lesson={lesson}
                    moduleId={module.id}
                    activeId={activeId}
                    onDelete={handleDeleteLesson}
                    onNavigate={handleNavigateLesson}
                  />
                ))}
              </SortableContext>
            </DroppableModule>
          ))}
        </div>
        <DragOverlay>
          {activeLesson ? (
            <li className="p-2 my-1 bg-yellow-100 border rounded shadow flex items-center gap-2">
              <span>
                <Icon type="drag" className="text-gray-400" />
              </span>
              {activeLesson.title}
            </li>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
