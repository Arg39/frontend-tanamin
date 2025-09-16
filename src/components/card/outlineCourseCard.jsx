import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../icons/icon';
import Checkbox from '../form/checkbox';

export default function OutlineCourseCard({
  modules = [],
  loading,
  error,
  onLessonSelect,
  selectedLessonId,
  openModuleIndex: openModuleIndexProp,
  isMobile = false,
}) {
  const [openModuleIndex, setOpenModuleIndex] = useState(openModuleIndexProp);

  useEffect(() => {
    setOpenModuleIndex(openModuleIndexProp);
  }, [openModuleIndexProp]);

  // Only allow click if lesson is completed OR lesson is before or equal to selectedLessonId
  const isLessonEnabled = (lessons, lessonIdx, selectedLessonId) => {
    const lesson = lessons[lessonIdx];
    if (lesson.id === selectedLessonId) return true; // always enable selected lesson
    if (lesson.completed) return true;
    // Find index of selectedLessonId in lessons
    const selectedIdx = lessons.findIndex((ls) => ls.id === selectedLessonId);
    // Enable if lessonIdx <= selectedIdx
    if (selectedIdx !== -1 && lessonIdx <= selectedIdx) return true;
    return false;
  };

  return (
    <div
      className={`p-4 border border-primary-700 rounded-lg mb-4 bg-white ${
        isMobile ? 'shadow-lg' : ''
      }`}
      style={{
        height: isMobile ? 'auto' : '600px',
        maxHeight: isMobile ? '70vh' : '600px',
        overflowY: 'auto',
      }}
    >
      <p className="font-bold text-2xl text-primary-700 mb-2">Outline Materi</p>
      {loading && <div className="text-secondary-700">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <ul>
          {modules.length === 0 && <li className="text-secondary-700">Belum ada modul.</li>}
          {modules.map((module, idx) => {
            // Show all lessons, do not filter by visible
            const lessons = module.lessons || [];
            return (
              <li key={module.id || idx} className="mb-2 ">
                <button
                  className={`w-full text-left flex gap-2 items-center py-2 pb-2 border-b border-secondary-700 font-semibold focus:outline-none ${
                    module.complete ? 'bg-green-100' : ''
                  }`}
                  onClick={() => setOpenModuleIndex(openModuleIndex === idx ? null : idx)}
                >
                  <span>
                    {openModuleIndex === idx ? (
                      <Icon type="arrow-down" className="w-4 h-4 text-secondary-700" />
                    ) : (
                      <Icon type="arrow-up" className="w-4 h-4 text-secondary-700" />
                    )}
                  </span>
                  <span className="text-secondary-700">{module.title}</span>
                  {module.complete && <Icon type="check" className="w-4 h-4 text-green-600 ml-2" />}
                </button>
                <AnimatePresence initial={false}>
                  {openModuleIndex === idx && (
                    <motion.ul
                      className="mt-2 origin-top flex flex-col gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      {lessons.map((lesson, lidx) => {
                        const selected = selectedLessonId === lesson.id;
                        const enabled = isLessonEnabled(lessons, lidx, selectedLessonId);
                        return (
                          <button
                            key={lesson.id || lidx}
                            className={`flex gap-2 p-1 px-2 rounded-md transition-colors ${
                              selected ? 'bg-primary-700 font-bold text-white' : 'bg-neutral-400'
                            } ${!enabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={() => enabled && onLessonSelect && onLessonSelect(lesson.id)}
                            disabled={!enabled}
                            title={
                              lesson.completed || selected
                                ? ''
                                : enabled
                                ? ''
                                : 'Selesaikan materi sebelumnya terlebih dahulu'
                            }
                          >
                            <Checkbox
                              checked={lesson.completed || false}
                              disabled={true}
                              onChange={() => {}}
                              box={true}
                            />
                            <span className="text-start">{lesson.title}</span>
                          </button>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 font-bold text-2xl text-primary-700 mb-2">Sertifikasi</p>
      <button className="w-full flex gap-2 p-1 bg-neutral-400 rounded-md px-2">
        <span className="text-start">Sertifikat</span>
      </button>
    </div>
  );
}
