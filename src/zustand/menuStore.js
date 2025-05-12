import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isMenuOpen: false,
  isAccountMenuOpen: false,
  activeNav: 'home',
  toggleMenu: () =>
    set((state) => ({
      isMenuOpen: !state.isMenuOpen,
      isAccountMenuOpen: state.isMenuOpen ? state.isAccountMenuOpen : false,
    })),
  toggleAccountMenu: () =>
    set((state) => ({
      isAccountMenuOpen: !state.isAccountMenuOpen,
      isMenuOpen: state.isAccountMenuOpen ? state.isMenuOpen : false,
    })),
  closeMenu: () => set({ isMenuOpen: false }),
  closeAccountMenu: () => set({ isAccountMenuOpen: false }),
  setActiveNav: (nav) => set({ activeNav: nav }),
}));

export default useMenuStore;
