import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useMessageStore = create((set) => ({
  loading: false,
  error: null,
  success: false,
  messages: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  },
  sortBy: 'first_name',
  sortOrder: 'asc',
  perPage: 10,

  async fetchMessages({
    sortBy = 'first_name',
    sortOrder = 'asc',
    perPage = 10,
    page = 1,
    name = '',
    subject = '',
    dateStart = '',
    dateEnd = '',
  } = {}) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        perPage,
        page,
      });
      if (name) params.append('name', name);
      if (subject) params.append('subject', subject);
      if (dateStart) params.append('dateStart', dateStart);
      if (dateEnd) params.append('dateEnd', dateEnd);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/messages?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil pesan');
      set({
        messages: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
          perPage,
        },
        sortBy,
        sortOrder,
        perPage,
        error: null,
        loading: false,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  async sendMessage({ name, email, subject, message }) {
    set({ loading: true, error: null, success: false });
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengirim pesan');
      set({ loading: false, success: true, error: null });
      return json;
    } catch (e) {
      set({ loading: false, error: e.message, success: false });
      throw e;
    }
  },

  resetStatus() {
    set({ success: false, error: null });
  },
}));

export default useMessageStore;
