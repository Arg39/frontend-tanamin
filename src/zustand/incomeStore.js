import { create } from 'zustand';
import useAuthStore from './authStore';

const useIncomeStore = create((set, get) => ({
  loading: false,
  error: null,
  dailyIncome: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  perPage: 10,
  sortBy: 'date',
  sortOrder: 'desc',

  async fetchDailyIncome({ perPage = 10, page = 1, sortBy = 'date', sortOrder = 'desc' } = {}) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({
        perPage,
        page,
        sortBy,
        sortOrder,
      });
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/dailyIncome?${params.toString()}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Gagal mengambil data pendapatan');
      set({
        dailyIncome: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
        },
        perPage,
        sortBy,
        sortOrder,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
  },
}));

export default useIncomeStore;
