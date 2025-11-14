import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from './authStore';

const useInstructorStore = create((set) => ({
  instructors: [],
  instructorSelectOptions: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: 'nama',
  sortOrder: 'asc',
  perPage: 5,
  error: null,

  fetchInstructors: async (params = {}) => {
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
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructors`,
        {
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
        }
      );

      if (response.status === 200) {
        const items = response.data.data.items || [];
        const pagination = response.data.data.pagination || {};
        set({
          instructors: items,
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
      const errorMessage = error.response?.data?.message || 'Failed to fetch instructors';
      set({ error: errorMessage });
    }
  },

  fetchInstructorOptions: async (category_id = null) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Unauthorized: No token found' });
      return [];
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor-select`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: category_id ? { category_id } : {},
        }
      );
      if (response.status === 200) {
        const options = response.data.data.map((instructor) => ({
          value: instructor.id,
          label: instructor.name,
        }));
        set({ instructorSelectOptions: options, error: null });
        return options;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch instructor options';
      set({ error: errorMessage });
      return [];
    }
  },

  addInstructor: async (formData) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ error: 'Unauthorized: No token found' });
      toast.error('Unauthorized: No token found');
      return { success: false, message: 'Unauthorized: No token found' };
    }

    try {
      const params = {
        ...formData,
        role: 'instructor',
        password_confirmation: formData.confirmPassword,
      };
      delete params.confirmPassword;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/register-instructor`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        return { success: true };
      } else {
        return { success: false, message: 'Gagal menambah instruktur' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal menambah instruktur';
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },
}));

export default useInstructorStore;
