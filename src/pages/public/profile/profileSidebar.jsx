import React, { useState, useEffect } from 'react';
import Template from '../../../template/template';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../zustand/authStore';
import Icon from '../../../components/icons/icon';
import { capitalizeWords } from '../../../components/dragAndDrop/utils';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function ProfileSidebar({ children }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogoutClick = () => {
    openConfirmationModal({
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      variant: 'danger',
      onConfirm: () => {
        logout();
        navigate('/');
        toast.success('Anda telah berhasil keluar dari akun.');
        setDropdownOpen(false);
        setSidebarOpen(false);
      },
      onCancel: () => {
        setDropdownOpen(false);
        setSidebarOpen(false);
      },
    });
  };

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <nav className="w-80 h-[calc(100vh-64px)] sm:h-full border-4 border-primary-700 rounded-lg p-6 shadow-lg bg-white">
      <div className="space-y-4">
        <div className="w-full flex flex-col gap-4 items-center">
          {/* profile picture */}
          {!user?.photo_profile || user.photo_profile === '' ? (
            <span className="w-32 h-32 flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 p-8">
              <Icon type="user" className="w-full h-full" />
            </span>
          ) : (
            <img
              src={user.photo_profile}
              alt="Profile"
              className="w-32 h-32 rounded-full border border-gray-200 object-cover"
            />
          )}
          <div className="flex justify-center w-full">
            <div className="text-center break-words max-w-xs mx-auto">
              {capitalizeWords(user?.first_name) + ' ' + capitalizeWords(user?.last_name)}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            navigate('/profil');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-primary-700 transition-colors"
        >
          <Icon type={'user'} className="w-7 h-7" />
          <span>Profil</span>
        </button>
        <button
          onClick={() => {
            navigate('/kursus-saya');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-primary-700 transition-colors"
        >
          <Icon type={'book'} className="w-7 h-7" />
          <span>Course Saya</span>
        </button>
        <button
          onClick={() => {
            navigate('/riwayat-pembelian');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-primary-700 transition-colors"
        >
          <Icon type={'work-history'} className="w-7 h-7" />
          <span>Riwayat Pembelian</span>
        </button>
        <button
          onClick={() => {
            navigate('/bookmark');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-primary-700 transition-colors"
        >
          <Icon type={'bookmark'} className="w-7 h-7" />
          <span>Bookmark</span>
        </button>
      </div>
      <div className="flex flex-col mt-12 gap-4">
        <p className="">User</p>
        <button
          onClick={() => {
            navigate('/bookmark');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-primary-700 transition-colors"
        >
          <Icon type={'gear'} className="w-7 h-7" />
          <span>Pengaturan</span>
        </button>
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-4 pb-4 border-b border-gray-300 hover:text-error-700 transition-colors"
        >
          <Icon type={'logout'} className="w-7 h-7" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );

  return (
    <Template locationKey={location.key}>
      <div className="flex w-full min-h-[60vh] px-0 sm:px-16">
        {/* Mobile: Floating Button */}
        {isMobile && (
          <>
            <button
              className="fixed top-16 left-4 z-50 bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu profil"
              type="button"
            >
              <Icon type="user" className="w-8 h-8" />
            </button>
            {/* Sidebar Drawer */}
            {sidebarOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 z-40"
                  onClick={() => setSidebarOpen(false)}
                />
                {/* Drawer */}
                <aside
                  className="fixed top-0 left-0 z-50 w-80 max-w-full transition-transform duration-300 rounded-r-lg flex flex-col"
                  style={{
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    height: 'calc(100dvh - 54px)',
                    top: '64px',
                  }}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-primary-700"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Tutup menu"
                  >
                    <Icon type="close" className="w-7 h-7" />
                  </button>
                  {SidebarContent}
                </aside>
              </>
            )}
          </>
        )}

        {/* Desktop: Sticky Sidebar */}
        <aside
          className={`hidden md:block px-6 py-8 h-fit sticky top-10`}
          style={{ alignSelf: 'flex-start' }}
        >
          {SidebarContent}
        </aside>

        {/* Content */}
        <main className="w-full px-2 sm:px-0 sm:pr-6 py-8 pt-20 sm:pt-8">{children}</main>
      </div>
    </Template>
  );
}
