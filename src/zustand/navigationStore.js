import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  navigationAdmin: [
    {
      label: 'gambaran umum',
      links: [{ text: 'dashboard', href: '/admin/dashboard', icon: 'round-dashboard' }],
    },
    {
      label: 'kursus',
      links: [
        { text: 'kategori', href: '/admin/kategori', icon: 'swatch' },
        { text: 'kursus', href: '/admin/kursus', icon: 'book' },
      ],
    },
    {
      label: 'keuangan',
      links: [
        { text: 'pembayaran kursus', href: '/admin/pembayaran-kursus', icon: 'payment-solid' },
        { text: 'pemasukan', href: '/admin/pemasukan', icon: 'money' },
      ],
    },
    {
      label: 'konten',
      links: [
        { text: 'informasi perusahaan', href: '/admin/informasi', icon: 'info-rounded' },
        { text: 'faq', href: '/admin/faq', icon: 'faq' },
      ],
    },
    {
      label: 'pengguna',
      links: [
        { text: 'instruktur', href: '/admin/instruktur', icon: 'user-filled' },
        { text: 'siswa', href: '/admin/siswa', icon: 'user-filled' },
      ],
    },
    {
      label: 'pesan',
      links: [{ text: 'pesan', href: '/admin/pesan', icon: 'message-question' }],
    },
  ],

  navigationInstructor: [
    {
      label: 'gambaran umum',
      links: [{ text: 'dashboard', href: '/instruktur/dashboard', icon: 'round-dashboard' }],
    },
    {
      label: 'kursus',
      links: [
        { text: 'kursus', href: '/instruktur/kursus', icon: 'book' },
        { text: 'kategori', href: '/instruktur/kategori', icon: 'swatch' },
      ],
    },
    {
      label: 'keuangan',
      links: [
        { text: 'pemasukan', href: '/instruktur/pemasukan', icon: 'money' },
        { text: 'pembayaran kursus', href: '/instruktur/pembayaran-kursus', icon: 'payment-solid' },
      ],
    },
  ],

  courseDetailTabs: [
    { key: 'ringkasan', label: 'Ringkasan' },
    { key: 'atribut', label: 'Atribut' },
    { key: 'materi', label: 'Materi' },
    { key: 'ulasan', label: 'Ulasan' },
  ],
}));

export default useNavigationStore;
