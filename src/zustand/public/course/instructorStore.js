import { create } from 'zustand';
import axios from 'axios';

const useInstructorStore = create((set, get) => ({
  instructors: [],
  loading: false,
  error: null,

  fetchInstructors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/instructor-list`
      );
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

  fetchMoreInstructors: async (categoryId, more) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/instructor-list`,
        {
          params: {
            category_id: categoryId,
            more: more, // always starts from 1
          },
        }
      );
      if (response.status === 200) {
        const newData = response.data.data;
        const currentInstructors = get().instructors;
        const updatedInstructors = currentInstructors.map((cat) => {
          if (cat.category.id === categoryId) {
            // Avoid duplicate users
            const existingIds = new Set(cat.user.map((u) => u.id));
            const filteredNewUsers = newData[0].user.filter((u) => !existingIds.has(u.id));
            return {
              ...cat,
              user: [...cat.user, ...filteredNewUsers],
              has_more: newData[0].has_more,
            };
          }
          return cat;
        });
        set({ instructors: updatedInstructors, loading: false });
      } else {
        set({ error: 'Failed to fetch more instructors', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch more instructors',
        loading: false,
      });
    }
  },
}));

export default useInstructorStore;
