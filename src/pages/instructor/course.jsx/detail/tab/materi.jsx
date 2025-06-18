import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Icon from '../../../../../components/icons/icon';
import SortableLesson from '../../../../../components/dragAndDrop/sortableLesson';
import SortableModule from '../../../../../components/dragAndDrop/sortableModule';
import useModuleStore from '../../../../../zustand/material/moduleStore';

export default function ModuleList() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { fetchModules, modules, loading, error } = useModuleStore();

  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    fetchModules(courseId).catch((err) => toast.error(err.message || 'Failed to fetch modules'));
  }, [courseId, fetchModules]);

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

    // Update state
    toast.success('Modules reordered successfully');
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

    // Update state
    toast.success('Lesson moved successfully');
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
  const handleNavigateLesson = (lessonId) => navigateTo(`/materi/${lessonId}/lihat`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
        {modules.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada modul, silahkan tambahkan.</p>
        ) : (
          <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={modules.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                {modules.map((module) => (
                  <SortableModule
                    key={module.id}
                    id={module.id}
                    module={module}
                    isOver={overId === module.id}
                    onAddLesson={handleAddLesson}
                    onDeleteModule={() => toast.info('Delete module not implemented')}
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
                          onDelete={() => toast.info('Delete lesson not implemented')}
                          onEdit={handleEditLesson}
                          onNavigate={handleNavigateLesson}
                        />
                      ))}
                    </SortableContext>
                  </SortableModule>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>{activeId && <p>Dragging {activeId}</p>}</DragOverlay>
          </DndContext>
        )}
      </div>
    </>
  );
}
