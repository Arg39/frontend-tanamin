import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Icon from '../../../../../components/icons/icon';
import SortableLesson from '../../../../../components/dragAndDrop/sortableLesson';
import SortableModule from '../../../../../components/dragAndDrop/sortableModule';
import useModuleStore from '../../../../../zustand/material/moduleStore';
import useLessonStore from '../../../../../zustand/material/lessonStore';
import useAuthStore from '../../../../../zustand/authStore';

export default function ModuleList({ editable }) {
  const role = useAuthStore((state) => state.user?.role);
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const {
    fetchModules,
    modules: rawModules,
    loading,
    error,
    updateModuleOrder,
    deleteModule,
  } = useModuleStore();
  const { updateLessonOrder, deleteLesson } = useLessonStore();

  const modules = Array.isArray(rawModules) ? rawModules : [];
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

  const reorderModules = async (active, over) => {
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;

    const updated = [...modules];
    const [moved] = updated.splice(oldIdx, 1);
    updated.splice(newIdx, 0, moved);

    const newOrder = updated.map((m, idx) => ({
      id: m.id,
      order: idx,
    }));

    const toastId = toast.loading('Mengubah urutan modul...');

    try {
      const movedModule = newOrder.find((m) => m.id === active.id);
      await updateModuleOrder({ id: movedModule.id, order: movedModule.order });

      useModuleStore.setState({ modules: updated });

      toast.update(toastId, {
        render: 'Urutan modul berhasil diubah',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Gagal mengubah urutan modul',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const moveLesson = async (active, over) => {
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
    const newOrder = toLesIdx === -1 ? targetLessons.length : toLesIdx;
    if (toLesIdx === -1) {
      targetLessons.push(lesson);
    } else {
      targetLessons.splice(toLesIdx, 0, lesson);
    }

    newModules[toModuleIdx] = { ...newModules[toModuleIdx], lessons: targetLessons };

    // Loading toast
    const toastId = toast.loading('Mengubah urutan materi...');

    try {
      await updateLessonOrder({
        id: active.id,
        moveToModule: modules[toModuleIdx].id,
        order: newOrder,
      });

      // Update state
      useModuleStore.setState({ modules: newModules });

      toast.update(toastId, {
        render: 'Materi berhasil dipindahkan',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Gagal mengubah urutan materi',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragOver = (event) => setOverId(event.over?.id ?? null);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;

    const moduleIds = modules.map((m) => m.id);

    const isModule = moduleIds.includes(active.id) && moduleIds.includes(over.id);

    if (isModule) {
      reorderModules(active, over);
    } else {
      moveLesson(active, over);
    }
  };

  const navigateTo = (path) => navigate(`/instruktur/kursus/${courseId}${path}`);

  const handleAddModule = () => navigateTo('/modul/tambah');
  const handleEditModule = (moduleId) => navigateTo(`/modul/${moduleId}/edit`);
  const handleAddLesson = (moduleId) => navigateTo(`/modul/${moduleId}/materi/tambah`);
  const handleEditLesson = (moduleId, lessonId) => navigate(`/instruktur/materi/${lessonId}/edit`);
  const handleNavigateLesson = (lessonId) =>
    navigate(`${role === 'instructor' ? '/instruktur' : '/admin'}/materi/${lessonId}/lihat`);
  const handleDeleteModule = async (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;
    if (module.lessons && module.lessons.length > 0) {
      toast.info('Modul belum bisa dihapus karena ada materi pembelajaran didalamnya');
      return;
    }
    const toastId = toast.loading('Menghapus modul...');
    try {
      await deleteModule({ courseId, moduleId });
      toast.update(toastId, {
        render: 'Modul berhasil dihapus',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Gagal menghapus modul',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  const handleDeleteLesson = async (moduleId, lessonId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    if (!window.confirm(`Yakin ingin menghapus materi "${lesson.title}"?`)) return;

    const toastId = toast.loading('Menghapus materi...');
    try {
      await deleteLesson({ lessonId });

      // Remove lesson from state
      const newModules = modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      );
      useModuleStore.setState({ modules: newModules });

      toast.update(toastId, {
        render: 'Materi berhasil dihapus',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.message || 'Gagal menghapus materi',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading) return <p className="text-base text-black">Loading...</p>;
  if (error) return <p className="text-base text-red-600">{error}</p>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-800 mb-2 sm:mb-0">
          Daftar Materi Kursus
        </h1>
        {editable && (
          <button
            onClick={handleAddModule}
            className="w-full sm:w-auto px-4 py-2 bg-primary-700 text-white rounded hover:bg-primary-800 flex items-center gap-2"
          >
            <Icon type="plus" /> Modul
          </button>
        )}
      </div>

      <div className="p-2 sm:p-4 bg-gray-100 rounded-md overflow-x-auto">
        {modules.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada modul, silahkan tambahkan.</p>
        ) : editable ? (
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
                    onAddLesson={editable ? handleAddLesson : undefined}
                    onDeleteModule={editable ? handleDeleteModule : undefined}
                    onEditModule={editable ? handleEditModule : undefined}
                    editable={editable}
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
                          onDelete={editable ? handleDeleteLesson : undefined}
                          onEdit={editable ? handleEditLesson : undefined}
                          onNavigate={handleNavigateLesson}
                          editable={editable}
                        />
                      ))}
                    </SortableContext>
                  </SortableModule>
                ))}
              </div>
            </SortableContext>
            {/* <DragOverlay>{activeId && <p>Dragging</p>}</DragOverlay> */}
          </DndContext>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {modules.map((module) => (
              <SortableModule key={module.id} id={module.id} module={module} editable={editable}>
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
                    onNavigate={handleNavigateLesson}
                    editable={editable}
                  />
                ))}
              </SortableModule>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
