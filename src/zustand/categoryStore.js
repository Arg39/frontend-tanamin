import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
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

  addCategory: async (categoryData) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Unauthorized: No token found');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        toast.success('Kategori berhasil ditambahkan');
        set((state) => ({
          categories: [...state.categories, response.data.data],
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan kategori';
      toast.error(errorMessage);
    }
  },

  fetchCategoryById: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Unauthorized: No token found');
      return null;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal mengambil data kategori';
      toast.error(errorMessage);
      return null;
    }
  },

  updateCategory: async (id, categoryData) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Unauthorized: No token found');
      return;
    }

    categoryData.append('_method', 'PUT');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories/${id}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Kategori berhasil diperbarui');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui kategori';
      toast.error(errorMessage);
    }
  },
}));

export default useCategoryStore;
