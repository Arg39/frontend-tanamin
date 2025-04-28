import React, { useEffect } from 'react';
import Navbar from '../components/navigation/navbar';
import useMenuStore from '../zustand/menuStore';

export default function Template({ children, activeNav }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav); // Set the active navigation when the template is rendered
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="pt-16 lg:pt-20 px-4 lg:px-8 flex-1 z-0 relative">{children}</div>
    </div>
  );
}
