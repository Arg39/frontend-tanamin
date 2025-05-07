import React, { useEffect, useState, useCallback } from 'react';
import SidebarAdmin from '../components/navigation/admin/sidebar/sidebarAdmin';
import useMenuStore from '../zustand/menuStore';
import TopbarAdmin from '../components/navigation/admin/topbar/topbarAdmin';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import useNavigationStore from '../zustand/navigationStore';
import ConfirmationModal from '../components/modal/confirmationModal';
import { toast } from 'react-toastify';
import useAuthStore from '../zustand/authStore';

export default function AdminTemplate({ children, activeNav, className, style }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigationAdmin } = useNavigationStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State for ConfirmationModal

  const logout = useAuthStore((state) => state.logout);

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

  const handleLogout = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
    toast.success('Logout berhasil! Sampai jumpa lagi.');
    navigate('/');
    setIsModalOpen(false);
  }, [logout, navigate]);

  const cancelLogout = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
        {/* Topbar with sticky positioning */}
        <div className="sticky top-2 z-20">
          <TopbarAdmin
            onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
            onLogoutRequest={handleLogout}
          />
        </div>
        <div className={`mt-2 mr-4 ${className}`}>
          <Breadcrumb label={breadcrumb.label} text={breadcrumb.text} />
          {children}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
