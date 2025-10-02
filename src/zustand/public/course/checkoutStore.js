import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useCheckoutStore = create((set) => ({
  checkoutData: null,
  checkoutLoading: false,
  checkoutError: null,

  checkoutCartData: null,
  checkoutCartLoading: false,
  checkoutCartError: null,

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

  async fetchCheckoutCart() {
    set({ checkoutCartLoading: true, checkoutCartError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/checkout/cart`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') {
        set({
          checkoutCartData: null,
          checkoutCartLoading: false,
          checkoutCartError: json.message || 'Gagal mengambil data keranjang',
        });
        return;
      }
      set({
        checkoutCartData: json.data,
        checkoutCartLoading: false,
        checkoutCartError: null,
      });
    } catch (e) {
      set({
        checkoutCartData: null,
        checkoutCartLoading: false,
        checkoutCartError: e.message,
      });
    }
  },
}));

export default useCheckoutStore;
