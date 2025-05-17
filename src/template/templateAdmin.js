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
  const { navigationAdmin } = useNavigationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { isOpen, title, message, onConfirm, onCancel, closeModal, variant } =
    useConfirmationModalStore();

  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  const currentPath = location.pathname;
  let breadcrumb = { label: '', text: '' };
  navigationAdmin.forEach((section) => {
    section.links.forEach((link) => {
      if (currentPath.startsWith(link.href)) {
        breadcrumb = { label: section.label, text: link.text };
      }
    });
  });

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white-500">
      {/* Sidebar */}
      <SidebarAdmin
        activeNav={activeNav}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${className}`} style={style}>
          <div className="sticky top-0 lg:mx-0">
            <div className="w-full bg-white-500 h-6  absolute top-0 left-0 z-10"></div>
            <div className="pr-4 lg:pl-0 pl-4">
              <TopbarAdmin
                className={'relative top-4 z-20'}
                onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
              />
            </div>
          </div>
          <div className="pr-4 lg:pl-0 pl-4 pt-8">
            <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
            {children}
          </div>
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
        variant={variant}
      />
    </div>
  );
}
