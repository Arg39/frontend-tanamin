import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from '../authStore';

const dashboardStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  filter: {
    startDate: null,
    endDate: null,
  },

  fetchDashboardAdmin: async (startDate, endDate) => {
    set({ loading: true, error: null, filter: { startDate, endDate } });
    try {
      const token = useAuthStore.getState().token;
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/dashboard/admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          params,
        }
      );
      if (response.status === 200) {
        set({ data: response.data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch dashboard data', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
        loading: false,
      });
    }
  },

  fetchDashboardInstructor: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/dashboard/instructor`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (response.status === 200) {
        set({ data: response.data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch dashboard data', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
        loading: false,
      });
    }
  },
}));

export default dashboardStore;
