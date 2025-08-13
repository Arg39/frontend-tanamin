import React, { useState, useEffect } from 'react';
import Template from '../../template/template';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import useFaqStore from '../../zustand/public/faqStore';

const answerVariants = {
  collapsed: { opacity: 0, height: 0, y: -10, transition: { duration: 0.3 } },
  expanded: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3 } },
};

export default function Faq() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  const { faqList, loading, error, fetchFaq } = useFaqStore();

  useEffect(() => {
    fetchFaq();
  }, [fetchFaq]);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Frequently Asked Questions', path: location.pathname },
  ];

  return (
    <Template activeNav="faq" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Frequently Asked Question (FAQ)
          </h1>
          <p className="mt-4 text-primary-950 text-xl">
            Temukan jawaban atas pertanyaan Anda di bawah ini. Jika masih ada hal yang belum
            terjawab, jangan ragu untuk langsung menghubungi kami.
          </p>

          {/* faq */}
          <div className="mt-8 space-y-4">
            {loading && <div>Loading FAQ...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && faqList.length === 0 && (
              <div className="text-primary-700 text-xl">Belum ada FAQ.</div>
            )}
            {!loading &&
              !error &&
              faqList.map((item, idx) => (
                <div key={idx} className="border rounded-md border-primary-700 p-4">
                  <button
                    className="w-full text-left text-lg font-semibold text-primary-800 focus:outline-none flex justify-between items-center"
                    onClick={() => handleToggle(idx)}
                  >
                    {item.question}
                    <span className="text-primary-700 text-xl">
                      {openIndex === idx ? '-' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === idx && (
                      <motion.div
                        className="mt-2 text-primary-950 text-lg overflow-hidden"
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={answerVariants}
                      >
                        {item.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
          </div>
        </div>
      </main>
    </Template>
  );
}
