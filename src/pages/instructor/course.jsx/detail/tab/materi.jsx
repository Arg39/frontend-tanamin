import React, { useState, useMemo, useCallback } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Icon from '../../../../../components/icons/icon';
import SortableLesson from '../../../../../components/dragAndDrop/sortableLesson';
import SortableModule from '../../../../../components/dragAndDrop/sortableModule';

const initialData = [
  {
    id: 'module-1',
    title: 'Pengenalan Freelance UI/UX & Illustrator',
    lessons: [
      { id: 'lesson-1', type: 'material', title: 'Apa itu Freelance' },
      { id: 'lesson-2', type: 'material', title: 'Skillset yang Dibutuhkan' },
    ],
  },
  {
    id: 'module-2',
    title: 'Uji Pemahaman Dasar',
    lessons: [
      { id: 'lesson-3', type: 'material', title: 'Membuat Komponen' },
      { id: 'lesson-4', type: 'quiz', title: 'Props dan State' },
    ],
  },
  {
    id: 'module-3',
    title: 'State Management',
    lessons: [],
  },
];

export default function ModuleList() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState(initialData);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const findLessonLocation = useCallback(
    (lessonId) => {
      for (let moduleIdx = 0; moduleIdx < modules.length; moduleIdx++) {
        const lesIdx = modules[moduleIdx].lessons.findIndex((l) => l.id === lessonId);
        if (lesIdx !== -1) return { moduleIdx, lesIdx };
      }
      return null;
    },
    [modules]
  );

  const reorderModules = (active, over) => {
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;

    const updated = [...modules];
    const [moved] = updated.splice(oldIdx, 1);
    updated.splice(newIdx, 0, moved);

    setModules(updated);
    console.log(`module: {${updated.map((m) => `"${m.id}"`).join(', ')}}`);
  };

  const moveLesson = (active, over) => {
    const from = findLessonLocation(active.id);
    if (!from) return;

    let toModuleIdx = modules.findIndex((m) => m.id === over.id);
    let toLesIdx = -1;

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

    if (toModuleIdx === -1) return;

    if (from.moduleIdx === toModuleIdx && (toLesIdx === -1 || from.lesIdx === toLesIdx)) {
      return;
    }

    const lesson = modules[from.moduleIdx].lessons[from.lesIdx];
    const newModules = modules.map((m, idx) =>
      idx === from.moduleIdx ? { ...m, lessons: m.lessons.filter((l) => l.id !== active.id) } : m
    );

    const targetLessons = [...newModules[toModuleIdx].lessons];
    if (toLesIdx === -1) {
      targetLessons.push(lesson);
    } else {
      targetLessons.splice(toLesIdx, 0, lesson);
    }

    newModules[toModuleIdx] = { ...newModules[toModuleIdx], lessons: targetLessons };

    setModules(newModules);
    console.log(
      `move lesson: "${active.id}" -> module_id: "${newModules[toModuleIdx].id}", index: ${toLesIdx}`
    );
  };

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragOver = (event) => setOverId(event.over?.id ?? null);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;

    if (active.id.startsWith('module-') && over.id.startsWith('module-')) {
      reorderModules(active, over);
    } else {
      moveLesson(active, over);
    }
  };

  const navigateTo = (path) => navigate(`/instruktur/kursus/${courseId}${path}`);

  const handleAddModule = () => navigateTo('/modul/tambah');
  const handleEditModule = (moduleId) => navigateTo(`/modul/${moduleId}/edit`);
  const handleAddLesson = (moduleId) => navigateTo(`/modul/${moduleId}/materi/tambah`);
  const handleEditLesson = (modId, lesId) => navigateTo(`/modul/${modId}/materi/${lesId}/edit`);
  const handleNavigateLesson = (lessonId) => navigate(`/instructor/course/lesson/${lessonId}`);

  const handleDeleteModule = (moduleId) =>
    setModules((prev) => prev.filter((m) => m.id !== moduleId));

  const handleDeleteLesson = (modId, lesId) =>
    setModules((prev) =>
      prev.map((m) =>
        m.id === modId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lesId) } : m
      )
    );

  const activeLesson = useMemo(() => {
    if (!activeId?.startsWith('lesson-')) return null;
    for (const m of modules) {
      const l = m.lessons.find((l) => l.id === activeId);
      if (l) return l;
    }
    return null;
  }, [activeId, modules]);

  const activeModule = useMemo(
    () => activeId?.startsWith('module-') && modules.find((m) => m.id === activeId),
    [activeId, modules]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-800 mb-2 sm:mb-0">
          Daftar Materi Kursus
        </h1>
        <button
          onClick={handleAddModule}
          className="w-full sm:w-auto px-4 py-2 bg-primary-700 text-white rounded hover:bg-primary-800 flex items-center gap-2"
        >
          <Icon type="plus" /> Modul
        </button>
      </div>

      <div className="p-2 sm:p-4 bg-gray-100 rounded-md overflow-x-auto">
        <DndContext
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3 sm:gap-4">
              {modules.map((module) => (
                <SortableModule
                  key={module.id}
                  id={module.id}
                  module={module}
                  isOver={overId === module.id}
                  onAddLesson={handleAddLesson}
                  onDeleteModule={handleDeleteModule}
                  onEditModule={handleEditModule}
                >
                  <SortableContext
                    items={module.lessons.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {module.lessons.length === 0 && (
                      <li className="text-xs sm:text-sm text-gray-400 italic px-2 py-1">
                        (Belum ada pembelajaran)
                      </li>
                    )}
                    {module.lessons.map((lesson) => (
                      <SortableLesson
                        key={lesson.id}
                        lesson={lesson}
                        moduleId={module.id}
                        activeId={activeId}
                        onDelete={handleDeleteLesson}
                        onEdit={handleEditLesson}
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
              <div className="bg-white-100 p-2 sm:p-4 rounded shadow border-2 border-primary-400 opacity-80 min-w-[150px] sm:min-w-[200px]">
                <h2 className="text-base sm:text-lg font-semibold break-words">
                  {activeModule.title}
                </h2>
              </div>
            ) : activeLesson ? (
              <li className="p-2 my-1 bg-yellow-100 border rounded shadow flex items-center gap-2">
                <Icon type="drag" className="text-gray-400" />
                <span className="break-words">{activeLesson.title}</span>
              </li>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
