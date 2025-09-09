import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../icons/icon';
import Checkbox from '../form/checkbox';

export default function OutlineCourseCard({ modules = [], loading, error }) {
  const [openModuleIndex, setOpenModuleIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenModuleIndex(openModuleIndex === idx ? null : idx);
  };

  return (
    <div className="p-4 border border-primary-700 rounded-lg mb-4">
      <p className="font-bold text-2xl text-primary-700 mb-2">Outline Materi</p>
      {loading && <div className="text-secondary-700">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <ul>
          {modules.length === 0 && <li className="text-secondary-700">Belum ada modul.</li>}
          {modules.map((module, idx) => (
            <li key={module.id || idx} className="mb-2 ">
              <button
                className="w-full text-left flex gap-2 items-center py-2 pb-2 border-b border-secondary-700 font-semibold focus:outline-none"
                onClick={() => handleToggle(idx)}
              >
                <span>
                  {openModuleIndex === idx ? (
                    <Icon type="arrow-down" className="w-4 h-4 text-secondary-700" />
                  ) : (
                    <Icon type="arrow-up" className="w-4 h-4 text-secondary-700" />
                  )}
                </span>
                <span className="text-secondary-700">{module.title}</span>
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
                    {(module.lessons || []).map((lesson, lidx) => (
                      <button
                        key={lesson.id || lidx}
                        className="flex gap-2 p-1 px-2 bg-neutral-400 rounded-md"
                      >
                        <Checkbox
                          checked={lesson.learned || false}
                          disabled={true}
                          onChange={() => {}}
                          box={true}
                        />
                        <span className="text-start">{lesson.title}</span>
                      </button>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 font-bold text-2xl text-primary-700 mb-2">Sertifikasi</p>
      <button className="w-full flex gap-2 p-1 bg-neutral-400 rounded-md px-2">
        <span className="text-start">Final Exam Course</span>
      </button>
    </div>
  );
}
