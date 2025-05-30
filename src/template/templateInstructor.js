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
          <div className="sticky top-0 z-30 px-4 md:px-0 md:pr-4">
            <div className="relative " style={{ minHeight: '56px' }}>
              <div className="w-full bg-white-500 h-8 absolute top-0 left-0 z-0"></div>
              <div className="absolute top-4 left-0 w-full z-10">
                <TopbarAdmin
                  className={'z-30'}
                  onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                />
              </div>
            </div>
          </div>

          {/* Breadcrumb dan konten */}
          <div className="relative z-0 px-4 pb-4 lg:pl-0 pt-10">
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
