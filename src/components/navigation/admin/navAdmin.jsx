import React, { useState } from 'react';
import Sidebar from './sidebar/sidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '../../../zustand/authStore';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../modal/confirmationModal';

export default function SidebarAdmin({ activeNav }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Logout berhasil! Sampai jumpa lagi.');
    navigate('/');
    setIsModalOpen(false);
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  const navigations = [
    {
      label: 'gambaran umum',
      links: [{ text: 'dashboard', href: '/admin/dashboard', icon: 'round-dashboard' }],
    },
    {
      label: 'konten',
      links: [
        { text: 'course terbaik', href: '/admin/course-terbaik', icon: 'star' },
        { text: 'informasi perusahaan', href: '/admin/informasi', icon: 'book' },
        { text: 'faq', href: '/admin/faq', icon: 'bookmark' },
      ],
    },
    {
      label: 'pengguna',
      links: [
        { text: 'instruktur', href: '/admin/instruktur', icon: 'user' },
        { text: 'siswa', href: '/admin/siswa', icon: 'user' },
      ],
    },
    {
      label: 'kursus',
      links: [
        { text: 'kategori', href: '/admin/kategori', icon: 'archive-box' },
        { text: 'kursus', href: '/admin/kursus', icon: 'book' },
        { text: 'info pembayaran', href: '/admin/info-pembayaran', icon: 'cart' },
      ],
    },
    {
      label: 'pesan',
      links: [{ text: 'pesan', href: '/admin/pesan', icon: 'bell-alert' }],
    },
  ];

  return (
    <>
      <Sidebar
        title="Admin Panel"
        navigations={navigations}
        onLogout={handleLogout}
        activeNav={activeNav}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}
