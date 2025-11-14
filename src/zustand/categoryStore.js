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
  perPage: 5,
  error: null,

  fetchCategories: async ({
    sortBy = 'name',
    sortOrder = 'asc',
    perPage = 5,
    page = 1,
    name = '',
    dateRange = { start: '', end: '' },
  } = {}) => {
    set({ error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        perPage,
        page,
      });
      if (name) params.append('name', name);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch categories');
      set({
        categories: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
        },
        sortBy,
        sortOrder,
        perPage,
        error: null,
      });
    } catch (e) {
      set({ error: e.message });
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/category`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        set((state) => ({
          categories: [...state.categories, response.data.data],
        }));
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan kategori';
      return { success: false };
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/category/${id}`,
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/category/${id}`,
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

  deleteCategory: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      toast.error('Unauthorized: No token found');
      return;
    }

    const category = useCategoryStore.getState().categories.find((cat) => cat.id === id);
    if (category && category.used > 0) {
      toast.info('Kategori tidak bisa dihapus karena masih digunakan. pada beberapa kursus');
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Kategori berhasil dihapus');
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus kategori';
      toast.error(errorMessage);
    }
  },

  fetchCategoryOptions: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      return [];
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/categories-select`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const categories = response.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        set({ categories: response.data.data });
        return categories;
      }
    } catch (error) {
      return [];
    }
  },
}));

export default useCategoryStore;
