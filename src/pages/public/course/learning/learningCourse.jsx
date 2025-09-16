import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Template from '../../../../template/template';
import Breadcrumb from '../../../../components/breadcrumb/breadcrumb';
import OutlineCourseCard from '../../../../components/card/outlineCourseCard';
import useModuleStore from '../../../../zustand/public/course/learning/moduleStore';
import useLessonStore from '../../../../zustand/public/course/learning/lessonStore';
import MaterialContentCourse from './content/materialContentCourse';
import QuizContentCourse from './content/quizContentCourse';
import { toast } from 'react-toastify';
import Icon from '../../../../components/icons/icon';

// Custom hook to detect desktop/mobile
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
}

// 🔑 Helpers
function getFirstIncompleteLesson(modules) {
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      if (!lessons[l].completed && lessons[l].visible) {
        return lessons[l].id;
      }
    }
  }
  return null;
}

function getLastLesson(modules) {
  for (let m = modules.length - 1; m >= 0; m--) {
    const lessons = modules[m].lessons || [];
    if (lessons.length > 0) {
      return lessons[lessons.length - 1].id;
    }
  }
  return null;
}

function getNextVisibleLesson(modules, selectedLessonId) {
  let found = false;
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      if (found && lessons[l].visible) return lessons[l].id;
      if (lessons[l].id === selectedLessonId) found = true;
    }
  }
  return null;
}

export default function LearningCourse() {
  const location = useLocation();
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { modules, loading, error, fetchModules, status, saveLessonProgress, reloadModules } =
    useModuleStore();
  const { lesson, loading: lessonLoading, error: lessonError, fetchLesson } = useLessonStore();

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  // Fetch modules once per courseId
  useEffect(() => {
    if (courseId) {
      fetchModules(courseId, () => {
        toast.error('Anda tidak memiliki akses ke kursus ini');
        navigate(`/kursus/${courseId}`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Set selectedLessonId dan openModuleIndex saat modules baru didapat
  useEffect(() => {
    if (modules && modules.length > 0) {
      let firstIncomplete = getFirstIncompleteLesson(modules);
      let initialLessonId = firstIncomplete || getLastLesson(modules);

      if (initialLessonId) {
        setSelectedLessonId(initialLessonId);

        const idx = modules.findIndex(
          (module) =>
            module.lessons && module.lessons.some((lesson) => lesson.id === initialLessonId)
        );
        setOpenModuleIndex(idx !== -1 ? idx : 0);
      } else {
        setSelectedLessonId(null);
        setOpenModuleIndex(null);
      }
    } else {
      setSelectedLessonId(null);
      setOpenModuleIndex(null);
    }
  }, [modules]);

  // Update openModuleIndex jika selectedLessonId berubah
  useEffect(() => {
    if (selectedLessonId && modules && modules.length > 0) {
      const idx = modules.findIndex(
        (module) =>
          module.lessons && module.lessons.some((lesson) => lesson.id === selectedLessonId)
      );
      if (idx !== -1) setOpenModuleIndex(idx);
    }
  }, [selectedLessonId, modules]);

  // Fetch lesson ketika selectedLessonId berubah
  useEffect(() => {
    if (selectedLessonId) fetchLesson(selectedLessonId);
  }, [selectedLessonId, fetchLesson]);

  const handleLessonSelect = useCallback(
    (lessonId) => {
      setSelectedLessonId(lessonId);
      if (!isDesktop) setIsOutlineOpen(false); // close modal on mobile
    },
    [isDesktop]
  );

  // Next lesson logic
  const nextLessonId = getNextVisibleLesson(modules, selectedLessonId);
  const hasNextLesson = !!nextLessonId;

  const handleNextLesson = useCallback(() => {
    if (nextLessonId) setSelectedLessonId(nextLessonId);
  }, [nextLessonId]);

  // Save progress + next
  const handleSaveProgressAndNext = useCallback(async () => {
    if (!selectedLessonId) return;
    const res = await saveLessonProgress(selectedLessonId);
    if (res.status === 'success') {
      handleNextLesson();
      await reloadModules(courseId);
    } else {
      toast.error(res.message || 'Gagal menyimpan progress');
    }
  }, [selectedLessonId, saveLessonProgress, handleNextLesson, reloadModules, courseId]);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId}` },
    { label: 'Belajar Kursus', path: location.pathname },
  ];

  let contentComponent = null;
  if (lessonLoading) {
    contentComponent = <div>Loading...</div>;
  } else if (lessonError) {
    contentComponent = <div className="text-red-500">{lessonError}</div>;
  } else if (lesson) {
    if (lesson.type === 'material') {
      contentComponent = (
        <MaterialContentCourse
          data={lesson || ''}
          onNextLesson={handleNextLesson}
          hasNextLesson={hasNextLesson}
          onSaveProgressAndNext={handleSaveProgressAndNext}
        />
      );
    } else if (lesson.type === 'quiz') {
      contentComponent = <QuizContentCourse data={lesson.content} />;
    } else {
      contentComponent = <div>Unknown lesson type</div>;
    }
  }

  return (
    <div>
      <Template activeNav="kursus.kursus" locationKey={location.key}>
        <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
          <Breadcrumb items={breadcrumbItems} />
          {/* Sticky Outline Button (mobile) */}
          {!isDesktop && (
            <button
              className="sticky top-16 left-4 z-50 w-12 h-12 flex items-center justify-center bg-primary-700 text-white rounded-full shadow-lg"
              onClick={() => setIsOutlineOpen(true)}
              aria-label="Lihat Outline Materi"
            >
              <Icon type="document" className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 w-full mt-8">
            <div className={`flex ${isDesktop ? '' : 'flex-col'}`}>
              {/* Sidebar Desktop */}
              {isDesktop && (
                <div className="w-1/4">
                  <div className="pr-4">
                    <OutlineCourseCard
                      modules={modules}
                      loading={loading}
                      error={error}
                      onLessonSelect={handleLessonSelect}
                      selectedLessonId={selectedLessonId}
                      openModuleIndex={openModuleIndex}
                      isMobile={false}
                    />
                  </div>
                </div>
              )}
              {/* Modal Mobile */}
              {!isDesktop && isOutlineOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setIsOutlineOpen(false)}
                  ></div>
                  <div className="relative w-full max-w-md mx-auto p-0">
                    <div className="relative bg-white rounded-md shadow-lg h-[80vh] overflow-y-auto">
                      <button
                        onClick={() => setIsOutlineOpen(false)}
                        className="absolute top-2 right-2 text-primary-700 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
                        aria-label="Tutup Outline"
                      >
                        ✕
                      </button>
                      <OutlineCourseCard
                        modules={modules}
                        loading={loading}
                        error={error}
                        onLessonSelect={handleLessonSelect}
                        selectedLessonId={selectedLessonId}
                        openModuleIndex={openModuleIndex}
                        isMobile={true}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className={isDesktop ? 'w-3/4' : 'w-full'}>{contentComponent}</div>
            </div>
          </div>
        </main>
      </Template>
    </div>
  );
}
