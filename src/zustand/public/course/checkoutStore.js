import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useCheckoutStore = create((set) => ({
  checkoutData: null,
  checkoutLoading: false,
  checkoutError: null,

  async fetchCheckout({ courseId }) {
    set({ checkoutLoading: true, checkoutError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/checkout/buy-now/${courseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') {
        set({
          checkoutData: null,
          checkoutLoading: false,
          checkoutError: json.message || 'Gagal mengambil data checkout',
        });
        return;
      }
      // Tidak perlu ubah, biarkan frontend yang handle fallback perhitungan
      set({
        checkoutData: json.data,
        checkoutLoading: false,
        checkoutError: null,
      });
    } catch (e) {
      set({
        checkoutData: null,
        checkoutLoading: false,
        checkoutError: e.message,
      });
    }
  },
}));

export default useCheckoutStore;
