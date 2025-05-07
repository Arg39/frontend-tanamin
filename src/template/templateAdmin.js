import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/navigation/admin/sidebar/sidebarAdmin';
import useMenuStore from '../zustand/menuStore';
import TopbarAdmin from '../components/navigation/admin/topbar/topbarAdmin';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import useNavigationStore from '../zustand/navigationStore';
import ConfirmationModal from '../components/modal/confirmationModal';
import { toast } from 'react-toastify';
import useAuthStore from '../zustand/authStore';
import useConfirmationModalStore from '../zustand/confirmationModalStore';

export default function AdminTemplate({ children, activeNav, className, style }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigationAdmin } = useNavigationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const { isOpen, title, message, onConfirm, onCancel, closeModal } = useConfirmationModalStore();

  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  // Breadcrumb logic
  const currentPath = location.pathname;
  let breadcrumb = { label: '', text: '' };
  navigationAdmin.forEach((section) => {
    section.links.forEach((link) => {
      if (link.href === currentPath) {
        breadcrumb = { label: section.label, text: link.text };
      }
    });
  });

  return (
    <div className="min-h-screen w-screen flex bg-white-500">
      {/* Sidebar */}
      <SidebarAdmin
        activeNav={activeNav}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`flex-1 mx-4 lg:mx-0`} style={style}>
        <div className="sticky top-2 z-20">
          <TopbarAdmin onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        </div>
        <div className={`mt-2 mr-4 ${className}`}>
          <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
          {children}
        </div>
      </div>

      {/* Global Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOpen}
        title={title}
        message={message}
        onConfirm={() => {
          onConfirm();
          closeModal();
        }}
        onCancel={() => {
          onCancel();
          closeModal();
        }}
        closeModal={closeModal}
      />
    </div>
  );
}
