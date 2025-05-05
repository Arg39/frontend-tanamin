import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const useCategoryStore = create((set) => ({
  categories: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: 'name',
  sortOrder: 'asc',
  perPage: 10,
  error: null,
  fetchCategories: async (params = {}) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Unauthorized: No token found' });
      return;
    }

    const { sortBy, sortOrder, perPage, page } = params;

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          sortBy: sortBy || 'name',
          sortOrder: sortOrder || 'asc',
          perPage: perPage || 10,
          page: page || 1,
        },
      });

      if (response.status === 200) {
        const { items, pagination } = response.data.data;
        set({
          categories: items,
          pagination: {
            currentPage: pagination.current_page,
            lastPage: pagination.last_page,
            total: pagination.total,
          },
          sortBy: sortBy || 'name',
          sortOrder: sortOrder || 'asc',
          perPage: perPage || 10,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      set({ error: errorMessage });
    }
  },
}));

export default useCategoryStore;
