import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  error: null,
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
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage });
    }
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null, error: null });
  },
}));

export default useAuthStore;
