import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/navigation/admin/sidebar/sidebarAdmin';
import useMenuStore from '../zustand/menuStore';
import TopbarAdmin from '../components/navigation/admin/topbar/topbarAdmin';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import useNavigationStore from '../zustand/navigationStore';

export default function AdminTemplate({ children, activeNav, className, style }) {
  const location = useLocation();
  const { navigationAdmin } = useNavigationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  // Find the current breadcrumb based on the URL
  const currentPath = location.pathname;
  let breadcrumb = { label: '', text: '' };

  navigationAdmin.forEach((section) => {
    section.links.forEach((link) => {
      if (link.href === currentPath) {
        breadcrumb = { label: section.label, text: link.text };
      }
    });
  });

  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  return (
    <div className="min-h-screen w-screen flex bg-white-500">
      {/* Sidebar */}
      <SidebarAdmin
        activeNav={activeNav}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content */}
      <div className={`flex-1 mx-4 lg:mx-0`} style={style}>
        <TopbarAdmin onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <div className={`mt-2 mr-4 ${className}`}>
          <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
          {children}
        </div>
      </div>
    </div>
  );
}
