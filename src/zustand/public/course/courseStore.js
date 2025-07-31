import { create } from 'zustand';
import axios from 'axios';

const useCourseStore = create((set) => ({
  course: null,
  error: null,
  loading: false,

  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${id}`
      );
      if (response.status === 200) {
        set({ course: response.data.data, loading: false });
      } else {
        set({ error: 'Gagal mengambil data kursus', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Gagal mengambil data kursus',
        loading: false,
      });
    }
  },
}));

export default useCourseStore;
