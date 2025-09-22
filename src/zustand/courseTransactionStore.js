import { create } from 'zustand';
import useAuthStore from './authStore';

const useCourseTransactionStore = create((set) => ({
  loading: false,
  error: null,
  transactions: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: '',
  sortOrder: '',
  perPage: 10,

  async fetchTransactions({ sortBy = '', sortOrder = '', perPage = 10, page = 1, user = '' } = {}) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        perPage,
        page,
      });
      if (user) params.append('user', user);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/transactions?${params.toString()}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil transaksi');
      set({
        transactions: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
        },
        sortBy,
        sortOrder,
        perPage,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },
}));

export default useCourseTransactionStore;
