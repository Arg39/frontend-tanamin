import { create } from 'zustand';
import useAuthStore from './authStore';

const useCompanyPartnershipStore = create((set, get) => ({
  partnerships: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 5,
  },
  loading: false,
  error: null,

  setPagination: (pagination) => set({ pagination }),

  fetchPartnerships: async ({
    page = get().pagination.currentPage,
    perPage = get().pagination.perPage,
  } = {}) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        page,
        perPage,
      });
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnerships?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Failed to fetch partnerships');
      set({
        partnerships: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage: json.data.pagination.per_page,
        },
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  addPartnership: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      if (data.logo) formData.append('logo', data.logo);
      formData.append('partner_name', data.partner_name);
      formData.append('website_url', data.website_url || '');

      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnership`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // 'Content-Type' intentionally omitted for FormData
        },
        body: formData,
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah partnership');
      set({ loading: false, error: null });
      // Optionally, refresh list
      await get().fetchPartnerships();
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  fetchPartnershipById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnership/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Failed to fetch partnership detail');
      set({ loading: false, error: null });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  updatePartnership: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      if (data.logo) formData.append('logo', data.logo);
      formData.append('partner_name', data.partner_name);
      formData.append('website_url', data.website_url || '');

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnership/${id}`,
        {
          method: 'POST', // Laravel Route::match(['put', 'post'], ...)
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // 'Content-Type' intentionally omitted for FormData
          },
          body: formData,
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengubah partnership');
      set({ loading: false, error: null });
      // Optionally, refresh list
      await get().fetchPartnerships();
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  deletePartnership: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnership/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menghapus partnership');
      set({ loading: false, error: null });
      // Refresh list setelah hapus
      await get().fetchPartnerships();
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useCompanyPartnershipStore;
