import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isMenuOpen: false,
  activeNav: 'home',
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  setActiveNav: (nav) => set({ activeNav: nav }), // Function to set active navigation
}));

export default useMenuStore;
