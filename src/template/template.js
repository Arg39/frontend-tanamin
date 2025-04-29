import React, { useEffect } from 'react';
import Navbar from '../components/navigation/navbar';
import useMenuStore from '../zustand/menuStore';

export default function Template({ children, activeNav, className, style }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav); // Set the active navigation when the template is rendered
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen w-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className={`w-screen flex-1 z-0 relative ${className}`} style={style}>
        {/* Background Gradient */}
        <div className="pt-16">{children}</div>
      </div>
    </div>
  );
}
