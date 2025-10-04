import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from '../authStore';

const usePurchaseHistoryStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchPurchaseHistory: async () => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/purchase-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ data: res.data.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal mengambil riwayat pembelian',
        loading: false,
      });
    }
  },
}));

export default usePurchaseHistoryStore;
