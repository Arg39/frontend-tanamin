import React, { useEffect, useRef, useState } from 'react';
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
  const [isBreadcrumbVisible, setIsBreadcrumbVisible] = useState(true);
  const scrollContainerRef = useRef(null);

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
      <div className="flex-1 pt-4 flex flex-col overflow-hidden">
        {/* Topbar tetap selalu di atas dan sticky */}
        <div className="sticky z-30 bg-white px-4 md:px-0 md:pr-4 border-b border-gray-200">
          <div style={{ minHeight: '56px' }}>
            <TopbarAdmin onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 lg:pl-0 ${className}`}
          ref={scrollContainerRef}
          style={{ style }}
        >
          {/* Breadcrumb */}
          {isBreadcrumbVisible && (
            <div className="mb-4">
              <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
            </div>
          )}

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
