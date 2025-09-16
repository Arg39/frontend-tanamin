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

export default function LearningCourse() {
  const location = useLocation();
  const courseId = useParams().courseId;
  const navigate = useNavigate();
  const { modules, loading, error, fetchModules, status } = useModuleStore();
  const {
    lesson,
    loading: lessonLoading,
    error: lessonError,
    fetchLesson,
    status: lessonStatus,
  } = useLessonStore();

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [openModuleIndex, setOpenModuleIndex] = useState(null);

  // Find the module index containing the selected lesson
  useEffect(() => {
    if (selectedLessonId && modules && modules.length > 0) {
      const idx = modules.findIndex(
        (module) =>
          module.lessons && module.lessons.some((lesson) => lesson.id === selectedLessonId)
      );
      if (idx !== -1) setOpenModuleIndex(idx);
    }
  }, [selectedLessonId, modules]);

  useEffect(() => {
    if (modules && modules.length > 0) {
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        if (module.lessons && module.lessons.length > 0) {
          setSelectedLessonId(module.lessons[0].id);
          setOpenModuleIndex(i);
          break;
        }
      }
    }
  }, [modules]);

  useEffect(() => {
    if (courseId) fetchModules(courseId);
  }, [courseId, fetchModules]);

  useEffect(() => {
    if (status === 'failed') {
      navigate(`/kursus/${courseId}`);
      toast.error('Anda tidak memiliki akses ke kursus ini');
    }
  }, [status, navigate, courseId]);

  // Otomatis pilih lesson pertama jika ada modules
  useEffect(() => {
    if (modules && modules.length > 0) {
      for (const module of modules) {
        if (module.lessons && module.lessons.length > 0) {
          setSelectedLessonId(module.lessons[0].id);
          break;
        }
      }
    }
  }, [modules]);

  // Fetch lesson ketika selectedLessonId berubah
  useEffect(() => {
    if (selectedLessonId) fetchLesson(selectedLessonId);
  }, [selectedLessonId, fetchLesson]);

  const handleLessonSelect = useCallback((lessonId) => {
    setSelectedLessonId(lessonId);
    // openModuleIndex will be set by useEffect above
  }, []);

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
      contentComponent = <MaterialContentCourse data={lesson || ''} />;
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
          <div className="flex-1 w-full mt-16">
            <div className="flex">
              <div className="w-1/4">
                <div className="pr-4">
                  <OutlineCourseCard
                    modules={modules}
                    loading={loading}
                    error={error}
                    onLessonSelect={handleLessonSelect}
                    selectedLessonId={selectedLessonId}
                    openModuleIndex={openModuleIndex}
                  />
                </div>
              </div>
              <div className="w-3/4">{contentComponent}</div>
            </div>
          </div>
        </main>
      </Template>
    </div>
  );
}
