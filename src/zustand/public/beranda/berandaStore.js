import { create } from 'zustand';
import axios from 'axios';

const useBerandaStore = create((set) => ({
  bestCourses: [],
  bestCoursesLoading: false,
  bestCoursesError: null,
  bestCoursesPagination: null,

  fetchBestCourses: async () => {
    set({ bestCoursesLoading: true, bestCoursesError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/best`
      );
      if (response.status === 200) {
        set({
          bestCourses: response.data.data.items,
          bestCoursesPagination: response.data.data.pagination,
          bestCoursesLoading: false,
        });
      } else {
        set({ bestCoursesError: 'Gagal mengambil kursus terbaik', bestCoursesLoading: false });
      }
    } catch (error) {
      set({
        bestCoursesError: error.response?.data?.message || 'Gagal mengambil kursus terbaik',
        bestCoursesLoading: false,
      });
    }
  },
}));

export default useBerandaStore;
