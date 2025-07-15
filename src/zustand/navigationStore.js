import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  navigationPublic: [
    {
      label: 'beranda',
      links: [{ text: 'Beranda', href: '/beranda' }],
    },
    {
      label: 'kursus',
      links: [
        { text: 'Kursus', href: '/kursus' },
        { text: 'Kategori', href: '/category' },
        { text: 'Instruktur', href: '/instruktur' },
      ],
    },
    {
      label: 'tentang-kami',
      links: [{ text: 'Tentang Kami', href: '/tentang-kami' }],
    },
    {
      label: 'faq',
      links: [{ text: 'FAQ', href: '/faq' }],
    },
    {
      label: 'kontak-kami',
      links: [{ text: 'Kontak Kami', href: '/kontak-kami' }],
    },
  ],

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
        {
          text: 'tentang perusahaan',
          href: '/admin/tentang-perusahaan/profil',
          icon: 'info-rounded',
        },
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
  ],

  courseDetailTabs: [
    { key: 'ringkasan', label: 'Ringkasan' },
    { key: 'atribut', label: 'Atribut' },
    { key: 'materi', label: 'Materi' },
    { key: 'ulasan', label: 'Ulasan' },
  ],

  companyAboutTabs: [
    { key: 'profil', label: 'Profil Perusahaan' },
    { key: 'kegiatan', label: 'Kegiatan Perusahaan' },
    { key: 'kerja-sama', label: 'Kerja Sama' },
  ],
}));

export default useNavigationStore;
