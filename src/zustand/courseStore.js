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
  instructorCourses: [],
  instructorPagination: {
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
  courseDetailByTab: null,
  courseDetailLoading: false,
  courseDetailError: null,

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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/course?${params}`, {
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

  async fetchInstructorCourses({
    sortBy = 'title',
    sortOrder = 'asc',
    perPage = 5,
    page = 1,
    search = '',
    category = '',
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
      if (dateStart) params.append('dateStart', dateStart);
      if (dateEnd) params.append('dateEnd', dateEnd);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/courses?${params.toString()}`,
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
        instructorCourses: json.data.items,
        instructorPagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage,
        },
        sortBy,
        sortOrder,
        error: null,
        loading: false,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  async deleteCourse(id) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menghapus kursus');
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  async fetchCourseDetailByTab({ tab, id }) {
    set({ courseDetailLoading: true, courseDetailError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}/${tab}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Gagal mengambil detail kursus');
      set({
        courseDetailByTab: json.data,
        courseDetailLoading: false,
        courseDetailError: null,
      });
    } catch (e) {
      set({ courseDetailError: e.message, courseDetailLoading: false, courseDetailByTab: null });
    }
  },

  async updateCourseDetail({ id, data }) {
    set({ courseDetailLoading: true, courseDetailError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}/overview/update`,
        {
          method: 'POST', // or 'PUT' if needed
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // 'Content-Type' intentionally omitted for FormData
          },
          body: data,
        }
      );
      const json = await res.json();
      if (json.status !== 'success') {
        set({
          courseDetailError: json.message || 'Gagal memperbarui ringkasan',
          courseDetailLoading: false,
        });
        return json;
      }
      set({
        courseDetailByTab: json.data,
        courseDetailLoading: false,
        courseDetailError: null,
      });
      return json;
    } catch (e) {
      set({ courseDetailError: e.message, courseDetailLoading: false });
      return { status: 'error', message: e.message };
    }
  },

  async updateCoursePrice({
    id,
    price,
    discount_type,
    discount_value,
    discount_start_at,
    discount_end_at,
    is_discount_active,
  }) {
    set({ courseDetailLoading: true, courseDetailError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}/overview/update-price`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            price,
            discount_type,
            discount_value,
            discount_start_at,
            discount_end_at,
            is_discount_active,
          }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') {
        set({
          courseDetailError: json.message || 'Gagal memperbarui harga',
          courseDetailLoading: false,
        });
        return json;
      }
      set({
        courseDetailByTab: json.data,
        courseDetailLoading: false,
        courseDetailError: null,
      });
      return json;
    } catch (e) {
      set({ courseDetailError: e.message, courseDetailLoading: false });
      return { status: 'error', message: e.message };
    }
  },
}));

export default useCourseStore;
