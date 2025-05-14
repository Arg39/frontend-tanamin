import { create } from 'zustand';
import useAuthStore from './authStore';

const useCourseStore = create((set, get) => ({
  courses: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
  sortBy: 'title',
  sortOrder: 'asc',
  perPage: 10,
  error: null,
  loading: false,

  async fetchCourses({ sortBy = 'title', sortOrder = 'asc', perPage = 10, page = 1 } = {}) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses?sortBy=${sortBy}&sortOrder=${sortOrder}&perPage=${perPage}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil data kursus');
      set({
        courses: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage,
        },
        sortBy,
        sortOrder,
        perPage,
        error: null,
        loading: false,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  async addCourse({ title, id_category, id_instructor }) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        title,
        id_category,
        id_instructor,
      }).toString();
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah kursus');
      // Optionally, update courses state here if needed
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useCourseStore;
