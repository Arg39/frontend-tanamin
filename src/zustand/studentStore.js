import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useStudentStore = create((set) => ({
  students: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: 'first_name',
  sortOrder: 'asc',
  perPage: 5,
  error: null,

  fetchStudents: async (params = {}) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Unauthorized: No token found' });
      return;
    }

    const { sortBy, sortOrder, perPage, page, filters } = params;

    // Prepare filter params for API
    let filterParams = {};
    if (filters) {
      if (filters.name) filterParams.name = filters.name;
      if (filters.created_at && (filters.created_at.start || filters.created_at.end)) {
        if (filters.created_at.start) filterParams.created_at_start = filters.created_at.start;
        if (filters.created_at.end) filterParams.created_at_end = filters.created_at.end;
      }
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          sortBy: sortBy || 'first_name',
          sortOrder: sortOrder || 'asc',
          perPage: perPage || 5,
          page: page || 1,
          ...filterParams,
        },
      });

      if (response.status === 200) {
        const items = response.data.data.items || [];
        const pagination = response.data.data.pagination || {};
        set({
          students: items,
          pagination: {
            currentPage: pagination.current_page || 1,
            lastPage: pagination.last_page || 1,
            total: pagination.total || items.length,
          },
          sortBy: sortBy || 'first_name',
          sortOrder: sortOrder || 'asc',
          perPage: perPage || 5,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      set({ error: errorMessage });
    }
  },
}));

export default useStudentStore;
