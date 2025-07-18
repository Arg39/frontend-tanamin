import { create } from 'zustand';
import useAuthStore from './authStore';

const useFaqStore = create((set, get) => ({
  faqs: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 5,
  },
  loading: false,
  error: null,

  setPagination: (pagination) => set({ pagination }),

  fetchFaqs: async ({
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/faqs?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch FAQs');
      set({
        faqs: json.data.items,
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

  fetchFaqById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/faq/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch FAQ detail');
      set({ loading: false, error: null });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  addFaq: async (faqData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(faqData),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah FAQ');
      set({ loading: false, error: null });
      // Optional: fetchFaqs() to refresh list
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  updateFaq: async (id, faqData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/faq/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(faqData),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengupdate FAQ');
      set({ loading: false, error: null });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  deleteFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/faq/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menghapus FAQ');
      set({ loading: false, error: null });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useFaqStore;
