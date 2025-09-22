import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Template from '../../../../template/template';
import Breadcrumb from '../../../../components/breadcrumb/breadcrumb';
import OutlineCourseCard from '../../../../components/card/outlineCourseCard';
import useModuleStore from '../../../../zustand/public/course/learning/moduleStore';
import useLessonStore from '../../../../zustand/public/course/learning/lessonStore';
import MaterialContentCourse from './content/materialContentCourse';
import QuizContentCourse from './content/quizContentCourse';
import CertificateContentCourse from './content/certificateContentCourse';
import { toast } from 'react-toastify';
import Icon from '../../../../components/icons/icon';
import AnsweredQuiz from './content/quiz/answeredQuiz';
import useCertificateStore from '../../../../zustand/public/course/learning/certificateStore';

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

function getLastLesson(modules = []) {
  for (let m = modules.length - 1; m >= 0; m--) {
    const lessons = modules[m].lessons || [];
    if (lessons.length > 0) return lessons[lessons.length - 1].id;
  }
  return null;
}

function getInitialLesson(modules = []) {
  const firstIncomplete = getFirstIncompleteLesson(modules);
  return firstIncomplete || getLastLesson(modules);
}

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

// Helper: get last lesson id
function getLastLessonId(modules = []) {
  for (let m = modules.length - 1; m >= 0; m--) {
    const lessons = modules[m].lessons || [];
    if (lessons.length > 0) return lessons[lessons.length - 1].id;
  }
  return null;
}

// Helper: check if all lessons completed
function areAllLessonsCompleted(modules = []) {
  for (let m = 0; m < modules.length; m++) {
    const lessons = modules[m].lessons || [];
    for (let l = 0; l < lessons.length; l++) {
      const lesson = lessons[l];
      if (!lesson?.completed) {
        return false;
      }
    }
  }
  return modules.length > 0;
}

export default function LearningCourse() {
  const location = useLocation();
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // Declare all useState hooks FIRST
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(null);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [manualLessonSelect, setManualLessonSelect] = useState(false);

  // Track initial load to only auto-show certificate once
  const initialLoadRef = useRef(true);

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

  const {
    certificate,
    loading: certificateLoading,
    error: certificateError,
    fetchCertificate,
    reset: resetCertificate,
  } = useCertificateStore();

  useEffect(() => {
    if (showCertificate && courseId) {
      fetchCertificate(courseId);
    } else {
      resetCertificate();
    }
  }, [showCertificate, courseId, fetchCertificate, resetCertificate]);

  const handleSubmitQuizAnswers = useCallback(
    async (answer) => {
      if (!selectedLessonId) return;
      const res = await submitQuizAnswers(selectedLessonId, answer);
      if (res.status === 'success') {
        await fetchQuizLesson(selectedLessonId);
      }
    },
    [selectedLessonId, submitQuizAnswers, fetchQuizLesson]
  );

  useEffect(() => {
    if (courseId) {
      fetchModules(courseId, () => {
        toast.error('Anda tidak memiliki akses ke kursus ini');
        navigate(`/kursus/${courseId}`);
      });
    }
  }, [courseId, fetchModules, navigate]);

  // Show certificate if all lessons completed on load/reload, but NOT after manual lesson select
  useEffect(() => {
    if (modules && modules.length > 0) {
      const allCompleted = areAllLessonsCompleted(modules);

      // Only auto-show certificate on initial load or after progress save, not after manual select
      if (allCompleted && !manualLessonSelect) {
        setShowCertificate(true);
        // Set selectedLessonId to last lesson for outline navigation
        const lastLessonId = getLastLessonId(modules);
        setSelectedLessonId(lastLessonId);
        const idx = modules.findIndex((module) =>
          (module.lessons || []).some((lesson) => lesson.id === lastLessonId)
        );
        setOpenModuleIndex(idx !== -1 ? idx : 0);
        initialLoadRef.current = false;
        return;
      }

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
        const idx = modules.findIndex((module) =>
          (module.lessons || []).some((lesson) => lesson.id === selectedLessonId)
        );
        if (idx !== -1) setOpenModuleIndex(idx);
      }
    }
  }, [modules, selectedLessonId, manualLessonSelect]);

  useEffect(() => {
    if (selectedLessonId && modules && modules.length > 0) {
      const idx = modules.findIndex((module) =>
        (module.lessons || []).some((lesson) => lesson.id === selectedLessonId)
      );
      if (idx !== -1) setOpenModuleIndex(idx);
    }
  }, [selectedLessonId, modules]);

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

  // If user selects a completed lesson from outline, show lesson (not certificate)
  const handleLessonSelect = useCallback(
    (lessonId) => {
      setSelectedLessonId(lessonId);
      setShowCertificate(false);
      setManualLessonSelect(true); // Mark as manual selection
      if (!isDesktop) setIsOutlineOpen(false);
    },
    [isDesktop]
  );

  // Next lesson logic
  const nextLessonId = getNextIncompleteLesson(modules || [], selectedLessonId);
  const lastLessonId = getLastLessonId(modules || []);
  const isLastLesson = selectedLessonId === lastLessonId;
  const hasNextLesson = !!nextLessonId || isLastLesson;

  // Next: jika lesson terakhir, tampilkan sertifikat
  const handleNextLesson = useCallback(() => {
    if (isLastLesson && areAllLessonsCompleted(modules)) {
      setShowCertificate(true);
      setManualLessonSelect(false); // Reset manual select when showing certificate
    } else if (nextLessonId) {
      setSelectedLessonId(nextLessonId);
      setManualLessonSelect(false);
    } else {
      toast.info('Tidak ada materi berikutnya');
    }
  }, [isLastLesson, nextLessonId, modules]);

  // Save progress + next: jika lesson terakhir, simpan progress lalu tampilkan sertifikat
  const handleSaveProgressAndNext = useCallback(async () => {
    if (!selectedLessonId) return;
    const res = await saveLessonProgress(selectedLessonId);
    if (res.status === 'success') {
      await reloadModules(courseId);
      // After reload, auto-show certificate if all completed
      if (isLastLesson && areAllLessonsCompleted(useModuleStore.getState().modules)) {
        setShowCertificate(true);
        setManualLessonSelect(false);
      } else {
        const newInitialLesson = getInitialLesson(useModuleStore.getState().modules);
        if (newInitialLesson) setSelectedLessonId(newInitialLesson);
        setManualLessonSelect(false);
      }
    } else {
      toast.error(res.message || 'Gagal menyimpan progress');
    }
  }, [selectedLessonId, saveLessonProgress, reloadModules, courseId, isLastLesson]);

  // Sertifikat: jika klik dari outline
  const handleShowCertificate = useCallback(() => {
    setShowCertificate(true);
    setIsOutlineOpen(false);
    setManualLessonSelect(false);
  }, []);

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId}` },
    { label: 'Belajar Kursus', path: location.pathname },
  ];

  // Certificate state for outline
  const allLessonsCompleted = areAllLessonsCompleted(modules);

  let contentComponent = null;
  if (showCertificate) {
    contentComponent = (
      <CertificateContentCourse
        data={certificate}
        loading={certificateLoading}
        error={certificateError}
        onNextLesson={() => {
          setShowCertificate(false);
          setSelectedLessonId(getInitialLesson(modules));
          setManualLessonSelect(false);
        }}
      />
    );
  } else if (lessonLoading) {
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
                  onShowCertificate={handleShowCertificate}
                  certificateActive={showCertificate}
                  certificateDisabled={!allLessonsCompleted}
                  sticky={true}
                />
              </div>
            )}
            {!isDesktop && isOutlineOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setIsOutlineOpen(false)}
                ></div>
                <div className="relative w-full mx-auto p-0 flex items-start justify-center">
                  <div className="relative w-full h-[calc(100vh-4rem)] mt-16 bg-white rounded-none shadow-none overflow-y-auto">
                    <button
                      onClick={() => setIsOutlineOpen(false)}
                      className="absolute top-4 right-4 text-primary-700 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10"
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
                      onShowCertificate={handleShowCertificate}
                      certificateActive={showCertificate}
                      certificateDisabled={!allLessonsCompleted}
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
  );
}
