import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('userData')) || null,
  token: localStorage.getItem('authToken') || null,
  error: null,

  register: async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/register`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Pendaftaran gagal';
      throw new Error(errorMessage);
    }
  },

  login: async (login, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/login`, {
        login,
        password,
      });
      const tokenData = response.data.data.token;
      const userData = response.data.data.user;

      localStorage.setItem('authToken', tokenData);
      localStorage.setItem('userData', JSON.stringify(userData));

      set({ token: tokenData, user: userData, error: null });
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      let errorMessage;

      switch (backendMessage) {
        case 'Invalid credentials':
          errorMessage = 'Username atau password salah.';
          break;
        case 'Account inactive':
          errorMessage = 'Akun Anda tidak aktif. Silakan hubungi admin.';
          break;
        default:
          errorMessage = 'Login gagal. Silakan coba lagi.';
      }

      set({ error: errorMessage });
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    set({ user: null, token: null, error: null });
  },

  fetchUserData: async () => {
    const { token, logout } = get();
    if (!token) return null;

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const userData = response.data.user;
        localStorage.setItem('userData', JSON.stringify(userData));
        set({ user: userData });
        return userData;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
      return null;
    }
  },

  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
