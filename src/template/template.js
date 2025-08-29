import React, { useEffect } from 'react';
import Navbar from '../components/navigation/public/navbar';
import useMenuStore from '../zustand/menuStore';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '../components/navigation/public/footer';
import useCompanyContactStore from '../zustand/companyContactStore';

export default function Template({ children, activeNav, className, style, locationKey }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  // Fetch contact only once at template level
  const { contact, loading, error, fetchContact } = useCompanyContactStore();

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  useEffect(() => {
    fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />

      <div className={`w-full flex-1 z-0 relative ${className}`} style={style}>
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

      <Footer contact={contact} loading={loading} error={error} />
    </div>
  );
}
