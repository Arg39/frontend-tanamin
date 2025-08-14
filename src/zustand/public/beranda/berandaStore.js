import { create } from 'zustand';
import axios from 'axios';

const useBerandaStore = create((set) => ({
  instructors: [],
  error: null,
  loading: false,

  courses: [],
  coursesError: null,
  coursesLoading: false,
  pagination: null,

  fetchInstructors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor`);
      if (response.status === 200) {
        set({ instructors: response.data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch instructors', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch instructors',
        loading: false,
      });
    }
  },

  fetchCourses: async ({ page = 1, search = '' } = {}) => {
    set({ coursesLoading: true, coursesError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses`,
        {
          params: { page, search },
        }
      );

      if (response.status === 200) {
        set({
          courses: response.data.data.items,
          pagination: response.data.data.pagination,
          coursesLoading: false,
        });
      } else {
        set({ coursesError: 'Failed to fetch courses', coursesLoading: false });
      }
    } catch (error) {
      set({
        coursesError: error.response?.data?.message || 'Failed to fetch courses',
        coursesLoading: false,
      });
    }
  },
}));

export default useBerandaStore;
