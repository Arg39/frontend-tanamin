import React, { useState } from 'react';
import Sidebar from './sidebar';
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
      label: 'Gambaran umum',
      links: [{ text: 'Dashboard', href: '/admin/dashboard', icon: 'round-dashboard' }],
    },
    {
      label: 'Konten',
      links: [
        { text: 'Course Terbaik', href: '/admin/course-terbaik', icon: 'star' },
        { text: 'Informasi Perusahaan', href: '/admin/informasi', icon: 'book' },
        { text: 'FAQ', href: '/admin/faq', icon: 'bookmark' },
      ],
    },
    {
      label: 'Pengguna',
      links: [
        { text: 'Instruktur', href: '/admin/instruktur', icon: 'user' },
        { text: 'Siswa', href: '/admin/siswa', icon: 'user' },
      ],
    },
    {
      label: 'Kursus',
      links: [
        { text: 'Kategori', href: '/admin/kategori', icon: 'archive-box' },
        { text: 'kursus', href: '/admin/kursus', icon: 'book' },
        { text: 'Info Pembayaran', href: '/admin/info-pembayaran', icon: 'cart' },
      ],
    },
    {
      label: 'Pesan',
      links: [{ text: 'Pesan', href: '/admin/pesan', icon: 'bell-alert' }],
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
