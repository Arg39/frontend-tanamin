import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isMenuOpen: false,
  isAccountMenuOpen: false, // New state for account menu
  activeNav: 'home',
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleAccountMenu: () => set((state) => ({ isAccountMenuOpen: !state.isAccountMenuOpen })), // Toggle account menu
  setActiveNav: (nav) => set({ activeNav: nav }), // Function to set active navigation
}));

export default useMenuStore;
