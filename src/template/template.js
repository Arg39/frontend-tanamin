import React, { useEffect } from 'react';
import Navbar from '../components/navigation/navbar';
import useMenuStore from '../zustand/menuStore';

export default function Template({ children, activeNav, className }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav); // Set the active navigation when the template is rendered
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen w-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="pt-14 lg:pt-20 w-screen flex-1 z-0 relative">
        <div className={`${className}`}>{children}</div>
      </div>
    </div>
  );
}
