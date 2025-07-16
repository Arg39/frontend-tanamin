import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useCompanyActivityStore = create((set, get) => ({
  activities: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 5,
  },
  perPage: 5,
  loading: false,
  error: null,

  setPagination: (pagination) => set({ pagination }),

  fetchActivities: async ({
    sortBy = 'created_at',
    sortOrder = 'desc',
    perPage = get().perPage,
    page = get().pagination.currentPage,
    title = '',
    dateRange = { start: '', end: '' },
  } = {}) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        perPage,
        page,
      });
      if (title) params.append('title', title);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/activities?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch activities');
      set({
        activities: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage: json.data.pagination.per_page,
        },
        perPage: json.data.pagination.per_page,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  addActivity: async ({ image, title, description }) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', title);
      formData.append('description', description);

      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/activity`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah aktivitas');
      set({ loading: false, error: null });
      // Optional: fetchActivities() to refresh list
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  updateActivity: async ({ id, image, title, description }) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      // Only append image if it's a File (new upload)
      if (image && typeof image !== 'string') {
        formData.append('image', image);
      }
      formData.append('title', title);
      formData.append('description', description);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/activity/${id}`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengubah aktivitas');
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useCompanyActivityStore;
