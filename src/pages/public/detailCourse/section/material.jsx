import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../../../components/icons/icon';

const dummyMaterialContent = [
  'Penjelasan singkat tentang pemanasan.',
  'Latihan peregangan dasar.',
  'Tips menjaga kebugaran sebelum latihan utama.',
];

export default function MaterialCourseDetail() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="material">
      <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
        Materi Kursus
      </p>
      <button
        className="w-full flex justify-between items-center p-4 border-b border-primary-700"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <p className="text-lg font-semibold">Warming up</p>
        <Icon type={isOpen ? 'minus' : 'plus'} className={'w-6 h-6 text-primary-700'} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="material-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-primary-100"
          >
            <ul className="p-4 pl-8 list-disc text-primary-800">
              {dummyMaterialContent.map((item, idx) => (
                <li key={idx} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
