import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null, // Tambahkan user ke state
  token: null,
  error: null,
  login: async (login, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/login`, {
        login,
        password,
      });
      const tokenData = response.data.data.token;
      const userData = response.data.data.user; // Asumsikan API mengembalikan data user

      localStorage.setItem('authToken', tokenData);

      // Update store dengan token dan user data
      set({ token: tokenData, user: userData, error: null });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage });
    }
  },
  logout: () => {
    // Hapus token dan user data dari localStorage dan store
    localStorage.removeItem('authToken');
    set({ user: null, token: null, error: null });
  },
}));

export default useAuthStore;
