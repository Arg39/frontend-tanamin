import React, { useEffect, useState } from 'react';
import useMenuStore from '../zustand/menuStore';
import TopbarAdmin from '../components/navigation/admin/topbar/topbarAdmin';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import useNavigationStore from '../zustand/navigationStore';
import ConfirmationModal from '../components/modal/confirmationModal';
import useConfirmationModalStore from '../zustand/confirmationModalStore';
import SidebarInstructor from '../components/navigation/admin/sidebar/sidebarInstructor';

export default function InstructorTemplate({ children, activeNav, className, style }) {
  const location = useLocation();
  const { navigationInstructor } = useNavigationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { isOpen, title, message, onConfirm, onCancel, closeModal, variant } =
    useConfirmationModalStore();

  const setActiveNav = useMenuStore((state) => state.setActiveNav);

  useEffect(() => {
    setActiveNav(activeNav);
  }, [activeNav, setActiveNav]);

  const currentPath = location.pathname;
  let breadcrumb = { label: '', text: '' };
  navigationInstructor.forEach((section) => {
    section.links.forEach((link) => {
      if (currentPath.startsWith(link.href)) {
        breadcrumb = { label: section.label, text: link.text };
      }
    });
  });

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white-500">
      {/* Sidebar */}
      <SidebarInstructor
        activeNav={activeNav}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content Area */}
      <div className="flex-1 pt-4 flex flex-col overflow-hidden">
        {/* Topbar tetap selalu di atas dan sticky */}
        <div className="sticky z-30 bg-white px-4 md:px-0 md:pr-4 border-b border-gray-200">
          <div style={{ minHeight: '56px' }}>
            <TopbarAdmin onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 lg:pl-0 ${className}`}
          // ref={scrollContainerRef}
          style={{ style }}
        >
          {/* Breadcrumb selalu tampil */}
          <div className="mb-4">
            <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
          </div>

          {/* Konten halaman */}
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
        variant={variant}
      />
    </div>
  );
}
