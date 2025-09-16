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
import AnsweredQuiz from './content/quiz/answeredQuiz';

// ✅ Cek device
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

/**
 * Cari lesson pertama yang belum complete (ikut urutan asli)
 * - Tampilkan semua lesson, tidak filter visible
 */
function getFirstIncompleteLesson(modules = []) {
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      const lesson = lessons[l];
      if (!lesson) continue;
      if (!lesson.completed) {
        return lesson.id;
      }
    }
  }
  return null;
}

// Cari lesson terakhir (fallback kalau semua complete)
function getLastLesson(modules = []) {
  for (let m = modules.length - 1; m >= 0; m--) {
    const lessons = modules[m].lessons || [];
    if (lessons.length > 0) return lessons[lessons.length - 1].id;
  }
  return null;
}

// Cari initial lesson → "lesson pertama yang belum complete"
function getInitialLesson(modules = []) {
  const firstIncomplete = getFirstIncompleteLesson(modules);
  return firstIncomplete || getLastLesson(modules);
}

/**
 * Cari lesson berikutnya yang belum complete (sesudah selectedLessonId)
 * - Tampilkan semua lesson, tidak filter visible
 */
function getNextIncompleteLesson(modules = [], selectedLessonId) {
  let found = false;
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      const lesson = lessons[l];
      if (!lesson) continue;
      if (found) {
        if (!lesson.completed) {
          return lesson.id;
        }
      }
      if (lesson.id === selectedLessonId) found = true;
    }
  }
  return null;
}

export default function LearningCourse() {
  const location = useLocation();
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const { modules, loading, error, fetchModules, saveLessonProgress, reloadModules } =
    useModuleStore();
  const {
    lesson,
    loading: lessonLoading,
    error: lessonError,
    fetchLesson,
    fetchQuizLesson,
    submitQuizAnswers,
    submitLoading,
    submitError,
    submitStatus,
  } = useLessonStore();

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  const handleSubmitQuizAnswers = useCallback(
    async (answer) => {
      if (!selectedLessonId) return;
      const res = await submitQuizAnswers(selectedLessonId, answer);
      if (res.status === 'success') {
        // Reload quiz lesson to show answered state
        await fetchQuizLesson(selectedLessonId);
      }
    },
    [selectedLessonId, submitQuizAnswers, fetchQuizLesson]
  );

  // Fetch modules
  useEffect(() => {
    if (courseId) {
      fetchModules(courseId, () => {
        toast.error('Anda tidak memiliki akses ke kursus ini');
        navigate(`/kursus/${courseId}`);
      });
    }
  }, [courseId, fetchModules, navigate]);

  // Set initial lesson (hanya kalau belum ada selectedLessonId atau selectedLessonId ga ada di modules)
  useEffect(() => {
    if (modules && modules.length > 0) {
      // Only consider all lessons, do not filter by visible
      const selectedExists =
        selectedLessonId &&
        modules.some((mod) => (mod.lessons || []).some((ls) => ls.id === selectedLessonId));

      if (!selectedLessonId || !selectedExists) {
        const initialLessonId = getInitialLesson(modules);
        if (initialLessonId) {
          setSelectedLessonId(initialLessonId);
          const idx = modules.findIndex((module) =>
            (module.lessons || []).some((lesson) => lesson.id === initialLessonId)
          );
          setOpenModuleIndex(idx !== -1 ? idx : 0);
        }
      } else {
        // kalau selectedLessonId masih ada, pastikan modulnya terbuka
        const idx = modules.findIndex((module) =>
          (module.lessons || []).some((lesson) => lesson.id === selectedLessonId)
        );
        if (idx !== -1) setOpenModuleIndex(idx);
      }
    }
    // intentionally include selectedLessonId so we can check existence
  }, [modules, selectedLessonId]);

  // Update openModuleIndex jika selectedLesson berubah
  useEffect(() => {
    if (selectedLessonId && modules && modules.length > 0) {
      const idx = modules.findIndex((module) =>
        (module.lessons || []).some((lesson) => lesson.id === selectedLessonId)
      );
      if (idx !== -1) setOpenModuleIndex(idx);
    }
  }, [selectedLessonId, modules]);

  // Fetch lesson data
  useEffect(() => {
    if (selectedLessonId && modules && modules.length > 0) {
      const selectedLesson = modules
        .flatMap((mod) => mod.lessons || [])
        .find((ls) => ls.id === selectedLessonId);

      if (selectedLesson) {
        if (selectedLesson.type === 'quiz') {
          fetchQuizLesson(selectedLessonId);
        } else {
          fetchLesson(selectedLessonId);
        }
      }
    }
  }, [selectedLessonId, fetchLesson, fetchQuizLesson, modules]);

  const handleLessonSelect = useCallback(
    (lessonId) => {
      setSelectedLessonId(lessonId);
      if (!isDesktop) setIsOutlineOpen(false);
    },
    [isDesktop]
  );

  // Next lesson logic
  const nextLessonId = getNextIncompleteLesson(modules || [], selectedLessonId);
  const hasNextLesson = !!nextLessonId;

  const handleNextLesson = useCallback(() => {
    if (nextLessonId) {
      setSelectedLessonId(nextLessonId);
    } else {
      toast.info('Tidak ada materi berikutnya');
    }
  }, [nextLessonId]);

  // Save progress + next
  const handleSaveProgressAndNext = useCallback(async () => {
    if (!selectedLessonId) return;
    const res = await saveLessonProgress(selectedLessonId);
    if (res.status === 'success') {
      await reloadModules(courseId);
      // setelah reload ambil initial lesson dari state store
      const newInitialLesson = getInitialLesson(useModuleStore.getState().modules);
      if (newInitialLesson) setSelectedLessonId(newInitialLesson);
    } else {
      toast.error(res.message || 'Gagal menyimpan progress');
    }
  }, [selectedLessonId, saveLessonProgress, reloadModules, courseId]);

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
          data={lesson}
          onNextLesson={handleNextLesson}
          hasNextLesson={hasNextLesson}
          onSaveProgressAndNext={handleSaveProgressAndNext}
        />
      );
    } else if (lesson.type === 'quiz') {
      contentComponent = (
        <QuizContentCourse
          data={lesson}
          onSubmitAnswers={handleSubmitQuizAnswers}
          submitLoading={submitLoading}
          submitError={submitError}
          submitStatus={submitStatus}
          onNextLesson={handleNextLesson}
          hasNextLesson={hasNextLesson}
          onSaveProgressAndNext={handleSaveProgressAndNext}
        />
      );
    } else {
      contentComponent = <div>Unknown lesson type</div>;
    }
  }

  return (
    <Template activeNav="kursus.kursus" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Tombol Outline (mobile) */}
        {!isDesktop && (
          <button
            className="sticky top-16 left-4 z-50 w-12 h-12 flex items-center justify-center bg-primary-700 text-white rounded-full shadow-lg"
            onClick={() => setIsOutlineOpen(true)}
          >
            <Icon type="document" className="w-6 h-6" />
          </button>
        )}

        <div className="flex-1 w-full mt-8">
          <div className={`flex ${isDesktop ? '' : 'flex-col'}`}>
            {/* Sidebar Desktop */}
            {isDesktop && (
              <div className="w-1/4 pr-4">
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
            )}

            {/* Modal Outline Mobile */}
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

            {/* Konten */}
            <div className={isDesktop ? 'w-3/4' : 'w-full'}>{contentComponent}</div>
          </div>
        </div>
      </main>
    </Template>
  );
}
