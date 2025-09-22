import React, { useEffect, useState } from 'react';
import Card from './card';
import { motion, AnimatePresence } from 'framer-motion';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

export default function StackedCourseCards({ courses }) {
  const isMobile = useIsMobile();
  const maxVisible = Math.min(3, courses?.length || 0);
  const [order, setOrder] = useState(Array.from({ length: maxVisible }, (_, i) => i));
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setOrder(Array.from({ length: maxVisible }, (_, i) => i));
  }, [courses, maxVisible]);

  if (!courses || courses.length === 0) {
    return (
      <div className="relative w-72 h-80 sm:w-80 sm:h-96 flex justify-center items-center">
        <div className="text-gray-400">Tidak ada kursus terbaik.</div>
      </div>
    );
  }

  // Only show up to maxVisible cards
  const visibleCards = order.map((idx) => courses[idx % courses.length]);

  const handleCardClick = () => {
    if (animating || courses.length <= 1) return;
    setAnimating(true);
    setOrder((prev) => {
      // Rotate only within available courses
      const next = [...prev.slice(1), (prev[prev.length - 1] + 1) % courses.length];
      return next;
    });
    setTimeout(() => setAnimating(false), 600);
  };

  const cardWidth = isMobile ? 260 : 340;
  const cardHeight = isMobile ? 400 : 480;
  const extraHeight = isMobile ? 100 : 120;

  // Animation variants for framer-motion
  const variants = [
    {
      initial: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      animate: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
      exit: { x: isMobile ? 120 : 160, y: 60, scale: 0.85, rotate: 12, opacity: 0 },
      transition: { type: 'spring', stiffness: 350, damping: 30 },
    },
    {
      initial: { x: isMobile ? 16 : 28, y: 8, scale: 0.96, rotate: 4, opacity: 0.95 },
      animate: { x: isMobile ? 16 : 28, y: 8, scale: 0.96, rotate: 4, opacity: 0.95 },
      exit: {},
      transition: { type: 'spring', stiffness: 350, damping: 30 },
    },
    {
      initial: { x: isMobile ? 32 : 56, y: 4, scale: 0.92, rotate: 8, opacity: 0.9 },
      animate: { x: isMobile ? 32 : 56, y: 4, scale: 0.92, rotate: 8, opacity: 0.9 },
      exit: {},
      transition: { type: 'spring', stiffness: 350, damping: 30 },
    },
  ];

  const stackStyles = [
    {
      zIndex: 20,
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      left: 0,
      top: 0,
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      willChange: 'transform',
    },
    {
      zIndex: 10,
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      left: isMobile ? 16 : 28,
      top: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      willChange: 'transform',
      cursor: 'pointer',
    },
    {
      zIndex: 0,
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
      left: isMobile ? 32 : 56,
      top: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      willChange: 'transform',
      cursor: 'pointer',
    },
  ];

  return (
    <div
      className="relative flex justify-center items-center"
      style={{
        width: `${cardWidth}px`, // No subtraction for mobile/desktop
        height: `${cardHeight + extraHeight}px`,
      }}
    >
      <AnimatePresence>
        {visibleCards.map((course, i) => (
          <motion.div
            key={course.id}
            className="absolute"
            style={stackStyles[i]}
            initial={variants[i].initial}
            animate={variants[i].animate}
            exit={i === 0 ? variants[i].exit : {}}
            transition={variants[i].transition}
            onClick={!animating ? handleCardClick : undefined}
            whileHover={i === 0 ? { scale: 1.04, boxShadow: '0 12px 32px rgba(0,0,0,0.22)' } : {}}
            whileTap={i === 0 ? { scale: 0.98 } : {}}
            layout
          >
            <Card
              course={course}
              content={true}
              maxWidth={cardWidth / 16}
              cardHeight={cardHeight}
              disableLink={true}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
