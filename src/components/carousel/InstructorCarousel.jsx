import React, { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Card for each instructor
function InstructorCard({ image, name, expertise, courseCount }) {
  return (
    <div
      className="bg-white rounded-xl flex-none flex flex-col items-center p-6 w-64 mx-2"
      style={{ boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.2)' }}
    >
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 border border-primary-900">
        <img src={image} alt={name} className="w-20 h-20 rounded-full object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-primary-900">{name}</h3>
      <p className="text-center text-primary-700 text-sm mb-2 line-clamp-2">{expertise}</p>
      <span className="text-xs text-gray-500">{courseCount} Course</span>
    </div>
  );
}

// Carousel for instructor cards
export default function InstructorCarousel({ instructors = [] }) {
  const carouselRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [x, setX] = React.useState(0);

  // Lebar satu kartu + margin (w-64 + mx-2 = 256px + 16px = 272px)
  const CARD_WIDTH = 272;

  React.useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      setContainerWidth(carouselRef.current.offsetWidth);
    }
  }, [instructors]);

  // Update animasi saat x berubah
  React.useEffect(() => {
    controls.start({ x });
  }, [x, controls]);

  // Drag constraints
  const minX = Math.min(-width, 0);
  const maxX = 0;

  const handleLeft = () => {
    setX((prev) => Math.min(prev + CARD_WIDTH, maxX));
  };

  const handleRight = () => {
    setX((prev) => Math.max(prev - CARD_WIDTH, minX));
  };

  // Snap ke kartu terdekat setelah drag
  const handleDragEnd = (_, info) => {
    let next = Math.round((x + info.offset.x) / CARD_WIDTH) * CARD_WIDTH;
    next = Math.max(Math.min(next, maxX), minX);
    setX(next);
  };

  return (
    <div className="relative w-full pr-4">
      {/* Left Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-primary-100 transition disabled:opacity-50"
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
      <div className="ml-[-24px] overflow-hidden w-full">
        <motion.div
          ref={carouselRef}
          className="flex flex-nowrap justify-start mx-4 py-4 cursor-grab"
          style={{ userSelect: 'none' }}
          drag="x"
          dragConstraints={{ left: minX, right: maxX }}
          dragElastic={0.1}
          animate={controls}
          whileTap={{ cursor: 'grabbing' }}
          onDragEnd={handleDragEnd}
        >
          {instructors.map((ins, idx) => (
            <InstructorCard key={ins.id || idx} {...ins} />
          ))}
        </motion.div>
      </div>

      {/* Right Button */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-primary-100 transition disabled:opacity-50"
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
