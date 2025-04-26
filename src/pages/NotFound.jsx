import React from 'react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white text-center font-bold">
      {/* Animasi Fuzzy Text untuk Heading */}
      <motion.h1
        className="text-[12vw] md:text-[14vw] sm:text-[16vw] font-extrabold"
        initial={{ filter: 'blur(10px)', opacity: 0 }}
        animate={{ filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        404
      </motion.h1>

      {/* Animasi Fuzzy Text untuk Paragraf */}
      <motion.p
        className="text-[4vw] md:text-[5vw] sm:text-[6vw] font-bold mt-4"
        initial={{ filter: 'blur(10px)', opacity: 0 }}
        animate={{ filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        Not Found
      </motion.p>
    </div>
  );
}
