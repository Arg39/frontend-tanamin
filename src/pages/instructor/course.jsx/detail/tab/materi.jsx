import React, { useState } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Icon from '../../../../../components/icons/icon';
import { useNavigate } from 'react-router-dom';
import SortableLesson from '../../../../../components/dragAndDrop/sortableLesson';
import { generateId } from '../../../../../components/dragAndDrop/utils';
import SortableModule from '../../../../../components/dragAndDrop/sortableModule'; // NEW

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

export default function ModuleList() {
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

    // MODULE DRAG
    if (active.id.startsWith('module-') && over.id.startsWith('module-')) {
      if (active.id === over.id) return;
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const newModules = [...modules];
      const [removed] = newModules.splice(oldIndex, 1);
      newModules.splice(newIndex, 0, removed);
      setModules(newModules);
      return;
    }

    // LESSON DRAG
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
    if (!activeId || !activeId.startsWith('lesson-')) return null;
    for (const module of modules) {
      const lesson = module.lessons.find((l) => l.id === activeId);
      if (lesson) return lesson;
    }
    return null;
  })();

  const activeModule = (() => {
    if (!activeId || !activeId.startsWith('module-')) return null;
    return modules.find((m) => m.id === activeId);
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
        collisionDetection={rectIntersection} // Changed from closestCenter to rectIntersection
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {modules.map((module) => (
              <SortableModule
                key={module.id}
                id={module.id}
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
                    <li className="text-sm text-gray-400 italic">(Belum ada pembelajaran)</li>
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
              </SortableModule>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeModule ? (
            <div className="bg-white-100 p-4 rounded shadow border-2 border-blue-400 opacity-80 min-w-[200px]">
              <h2 className="text-lg font-semibold">{activeModule.title}</h2>
            </div>
          ) : activeLesson ? (
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
