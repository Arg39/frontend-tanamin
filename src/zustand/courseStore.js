import { create } from 'zustand';
import useAuthStore from './authStore';

const useCourseStore = create((set, get) => ({
  courses: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 5,
  },
  sortBy: 'title',
  sortOrder: 'asc',
  perPage: 5,
  error: null,
  loading: false,

  async fetchCourses({
    sortBy = 'title',
    sortOrder = 'asc',
    perPage = 5,
    page = 1,
    search = '',
    category = '',
    instructor = '',
    dateStart = '',
    dateEnd = '',
  } = {}) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        perPage,
        page,
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (instructor) params.append('instructor', instructor);
      if (dateStart) params.append('dateStart', dateStart);
      if (dateEnd) params.append('dateEnd', dateEnd);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/courses?${params.toString()}`,
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
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useCourseStore;
