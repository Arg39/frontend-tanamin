import React, { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { InstructorCard } from '../card/cardInstructor';
import Icon from '../icons/icon';
import { useNavigate } from 'react-router-dom';

export default function InstructorCarousel({ instructors = [] }) {
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [x, setX] = React.useState(0);
  const navigate = useNavigate();

  // Responsive card width: 100% on mobile, 272px on desktop
  const CARD_WIDTH = 272;

  React.useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      setContainerWidth(carouselRef.current.offsetWidth);
    }
  }, [instructors]);

  React.useEffect(() => {
    controls.start({ x });
  }, [x, controls]);

  const minX = Math.min(-width, 0);
  const maxX = 0;

  const handleLeft = () => {
    setX((prev) => Math.min(prev + CARD_WIDTH, maxX));
  };

  const handleRight = () => {
    setX((prev) => Math.max(prev - CARD_WIDTH, minX));
  };

  const handleDragEnd = (_, info) => {
    let next = Math.round((x + info.offset.x) / CARD_WIDTH) * CARD_WIDTH;
    next = Math.max(Math.min(next, maxX), minX);
    setX(next);
  };

  const handleCardClick = (id) => {
    navigate(`/instruktur/detail/${id}`);
  };

  // Mouse wheel horizontal scroll
  const handleWheel = (e) => {
    if (width <= 0) return;
    // Only scroll horizontally if shift is not pressed (to avoid vertical scroll)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      let next = x - e.deltaX;
      next = Math.max(Math.min(next, maxX), minX);
      setX(next);
    }
  };

  // Touch swipe support
  const touchStartX = useRef(0);
  const lastX = useRef(x);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      lastX.current = x;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const delta = e.touches[0].clientX - touchStartX.current;
      let next = lastX.current + delta;
      next = Math.max(Math.min(next, maxX), minX);
      setX(next);
    }
  };

  // Prevent scrolling the page when swiping carousel
  const handleTouchEnd = (e) => {
    // Snap to nearest card
    let next = Math.round(x / CARD_WIDTH) * CARD_WIDTH;
    next = Math.max(Math.min(next, maxX), minX);
    setX(next);
  };

  return (
    <div className="relative w-full pr-0 sm:pr-4">
      {/* Left Button - only show on desktop */}
      <button
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-primary-100 transition disabled:opacity-50"
        onClick={handleLeft}
        disabled={x === maxX}
        aria-label="Geser kiri"
        type="button"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Carousel */}
      <div
        className="overflow-x-auto sm:overflow-hidden w-full"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <motion.div
          ref={carouselRef}
          className="flex flex-nowrap justify-start gap-2 sm:gap-4 py-4 cursor-grab"
          style={{ userSelect: 'none' }}
          drag="x"
          dragConstraints={{ left: minX, right: maxX }}
          dragElastic={0.1}
          animate={controls}
          whileTap={{ cursor: 'grabbing' }}
          onDragEnd={handleDragEnd}
        >
          {instructors.map((ins, idx) => (
            <InstructorCard
              key={ins.id || idx}
              id={ins.id}
              image={ins.image}
              name={ins.name}
              expertise={ins.expertise}
              courseCount={ins.courseCount}
              onClick={handleCardClick}
            />
          ))}
        </motion.div>
      </div>

      {/* Right Button - only show on desktop */}
      <button
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-primary-100 transition disabled:opacity-50"
        onClick={handleRight}
        disabled={x === minX || width <= 0}
        aria-label="Geser kanan"
        type="button"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor">
          <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
