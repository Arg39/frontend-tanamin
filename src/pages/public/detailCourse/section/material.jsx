import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/public/course/courseStore';
import WysiwygContent from '../../../../components/content/wysiwyg/WysiwygContent';

export default function MaterialCourseDetail({ courseId }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { material, materialLoading, materialError, fetchMaterialByCourseId } = useCourseStore();

  useEffect(() => {
    if (courseId) {
      fetchMaterialByCourseId(courseId);
    }
    // eslint-disable-next-line
  }, [courseId]);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="material">
      <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
        Materi Kursus
      </p>
      {materialLoading && <p className="p-4 text-primary-700">Loading materi...</p>}
      {materialError && <p className="p-4 text-red-500">{materialError}</p>}
      {!materialLoading &&
        !materialError &&
        material &&
        Array.isArray(material) &&
        material.length > 0 &&
        material.map((item, idx) => (
          <div key={item.id || idx} className="mb-2">
            <button
              className="w-full flex justify-between items-center p-4 border-b border-primary-700"
              onClick={() => handleToggle(idx)}
              type="button"
            >
              <p className="text-lg text-start font-semibold">{item.title}</p>
              <Icon
                type={openIndex === idx ? 'minus' : 'plus'}
                className={'w-6 h-6 text-primary-700'}
              />
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  key={`material-content-${item.id || idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-b border-primary-100"
                >
                  <WysiwygContent html={item.content} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
}
