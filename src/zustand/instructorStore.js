import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from './authStore';

const useInstructorStore = create((set) => ({
  instructors: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: 'first_name', // Default sorting by first_name
  sortOrder: 'asc', // Default sorting order asc
  perPage: 10,
  error: null,

  fetchInstructors: async (params = {}) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Unauthorized: No token found' });
      return;
    }

    const { sortBy, sortOrder, perPage, page } = params;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            sortBy: sortBy || 'first_name',
            sortOrder: sortOrder || 'asc',
            perPage: perPage || 10,
            page: page || 1,
          },
        }
      );

      if (response.status === 200) {
        const { data, pagination } = response.data;
        set({
          instructors: data,
          pagination: {
            currentPage: pagination?.current_page || 1,
            lastPage: pagination?.last_page || 1,
            total: pagination?.total || data.length,
          },
          sortBy: sortBy || 'first_name',
          sortOrder: sortOrder || 'asc',
          perPage: perPage || 10,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch instructors';
      set({ error: errorMessage });
    }
  },
}));

export default useInstructorStore;
