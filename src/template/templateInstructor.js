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
  // Ambil navigationInstructor, bukan navigationAdmin
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
  // Gunakan navigationInstructor untuk breadcrumb
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex-1 overflow-y-auto ${className}`} style={style}>
          <div className="pr-4 lg:pl-0 pl-4">
            <div className="sticky top-4 z-20 mb-6 lg:mx-0">
              <TopbarAdmin onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
            </div>

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
