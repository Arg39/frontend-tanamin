import React, { useEffect } from 'react';
import SidebarAdmin from '../components/navigation/admin/navAdmin';
import useMenuStore from '../zustand/menuStore';

export default function AdminTemplate({ children, activeNav, className, style }) {
  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen w-screen flex bg-white-500">
      {/* Sidebar */}
      <SidebarAdmin activeNav={activeNav} />

      {/* Content */}
      <div className={`flex-1 p-6 ${className}`} style={style}>
        {children}
      </div>
    </div>
  );
}
