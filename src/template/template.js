import React, { useEffect } from 'react';
import Navbar from '../components/navigation/public/navbar';
import useMenuStore from '../zustand/menuStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function Template({ children, activeNav, className, style, locationKey }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav); // Set the active navigation when the template is rendered
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />

      <div className={`w-screen flex-1 z-0 relative ${className}`} style={style}>
        <AnimatePresence mode="wait">
          <motion.div
            key={locationKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pt-[58px] h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
