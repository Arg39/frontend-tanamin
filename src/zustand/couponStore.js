import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from './authStore';

const useCouponStore = create((set) => ({
  coupons: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  sortBy: 'code',
  sortOrder: 'asc',
  perPage: 5,
  error: null,
  loading: false,

  fetchCoupons: async ({
    sortBy = 'code',
    sortOrder = 'asc',
    perPage = 5,
    page = 1,
    code = '',
    dateRange = { start: '', end: '' },
  } = {}) => {
    set({ error: null, loading: true });
    try {
      const token = useAuthStore.getState().token;
      const params = {
        sortBy,
        sortOrder,
        perPage,
        page,
      };
      if (code) params.code = code;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/coupons`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params,
      });
      const json = res.data;
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch coupons');
      set({
        coupons: json.data.items,
        pagination: {
          currentPage: json.data.pagination.current_page,
          lastPage: json.data.pagination.last_page,
          total: json.data.pagination.total,
        },
        sortBy,
        sortOrder,
        perPage,
        error: null,
        loading: false,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
      toast.error(e.message);
    }
  },

  getCouponById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/coupon/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = res.data;
      if (json.status !== 'success')
        throw new Error(json.message || 'Gagal mengambil detail kupon');
      set({ loading: false });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      toast.error(e.message);
      throw e;
    }
  },

  addCoupon: async (data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/coupon`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = res.data;
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah kupon');
      toast.success('Kupon berhasil ditambahkan!');
      set({ loading: false });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      toast.error(e.message);
      throw e;
    }
  },

  updateCoupon: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/coupon/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = res.data;
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengupdate kupon');
      toast.success('Kupon berhasil diupdate!');
      set({ loading: false });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      toast.error(e.message);
      throw e;
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/coupon/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = res.data;
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menghapus kupon');
      toast.success('Kupon berhasil dihapus!');
      set({ loading: false });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false });
      toast.error(e.message);
      throw e;
    }
  },
}));

export default useCouponStore;
