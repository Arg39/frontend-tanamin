import React from 'react';
import Sidebar from './sidebar';

export default function SidebarAdmin({ activeNav }) {
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
      <Sidebar title="Admin Panel" navigations={navigations} activeNav={activeNav} />
    </>
  );
}
