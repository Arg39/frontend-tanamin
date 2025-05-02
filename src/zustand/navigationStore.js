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
  setNavigationAdmin: (newNavigation) => set({ navigationAdmin: newNavigation }),
}));

export default useNavigationStore;
