import { create } from 'zustand';
import useAuthStore from './authStore';

const useStudentCourseStore = create((set, get) => ({
  students: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
  loading: false,
  error: null,
  filters: {
    name: '',
  },

  setPagination: (pagination) => set({ pagination }),
  setFilters: (filters) => set({ filters }),

  fetchStudents: async (
    courseId,
    {
      page = get().pagination.currentPage,
      perPage = get().pagination.perPage,
      filters = get().filters,
    } = {}
  ) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({ page, perPage });

      // Tambahkan filter nama jika ada
      if (filters && filters.name) {
        params.append('name', filters.name);
      }

      const res = await fetch(
        `${
          process.env.REACT_APP_BACKEND_BASE_URL
        }/api/course/${courseId}/students?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch students');
      set({
        students: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage: json.data.pagination.per_page,
        },
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  reviews: [],
  reviewsPagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
  reviewsLoading: false,
  reviewsError: null,
  reviewsFilters: {
    name: '',
    rating: '',
    date: { start: '', end: '' },
  },

  setReviewsPagination: (pagination) => set({ reviewsPagination: pagination }),
  setReviewsFilters: (filters) => set({ reviewsFilters: filters }),

  fetchReviews: async (
    courseId,
    {
      page = get().reviewsPagination.currentPage,
      perPage = get().reviewsPagination.perPage,
      filters = get().reviewsFilters,
    } = {}
  ) => {
    set({ reviewsLoading: true, reviewsError: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({ page, perPage });

      // Filter by name
      if (filters && filters.name) params.append('name', filters.name);
      // Filter by rating
      if (filters && filters.rating) params.append('rating', filters.rating);
      // Filter by date range
      if (filters && filters.date) {
        if (filters.date.start) params.append('start_date', filters.date.start);
        if (filters.date.end) params.append('end_date', filters.date.end);
      }

      const res = await fetch(
        `${
          process.env.REACT_APP_BACKEND_BASE_URL
        }/api/course/${courseId}/reviews?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch reviews');
      set({
        reviews: json.data.items,
        reviewsPagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage: json.data.pagination.per_page,
        },
        reviewsLoading: false,
        reviewsError: null,
      });
    } catch (e) {
      set({ reviewsError: e.message, reviewsLoading: false });
    }
  },
}));

export default useStudentCourseStore;
