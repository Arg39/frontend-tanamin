import React from 'react';
import Sidebar from './sidebar';

export default function SidebarAdmin({ activeNav }) {
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

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <Sidebar
      title="Admin Panel"
      navigations={navigations}
      onLogout={handleLogout}
      activeNav={activeNav}
    />
  );
}
