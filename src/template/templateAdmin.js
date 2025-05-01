import React, { useEffect } from 'react';
import SidebarAdmin from '../components/navigation/admin/sidebar/sidebarAdmin';
import useMenuStore from '../zustand/menuStore';
import TopbarAdmin from '../components/navigation/admin/topbar/topbarAdmin';

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
      <div className={`flex-1`} style={style}>
        <TopbarAdmin />
        <div className={`${className}`}>{children}</div>
      </div>
    </div>
  );
}
