import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isMenuOpen: false,
  isAccountMenuOpen: false,
  activeNav: 'home',
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleAccountMenu: () => set((state) => ({ isAccountMenuOpen: !state.isAccountMenuOpen })),
  setActiveNav: (nav) => set({ activeNav: nav }),
}));

export default useMenuStore;
