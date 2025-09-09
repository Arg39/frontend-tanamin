import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useCouponStore = create((set) => ({
  loading: false,
  error: null,
  couponResult: null,

  async applyCoupon({ courseId, coupon_code }) {
    set({ loading: true, error: null, couponResult: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/useCoupon/${courseId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ coupon_code }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menggunakan kupon');
      set({ loading: false, couponResult: json.data, error: null });
      return json; // <-- Return the whole response, not just json.data
    } catch (e) {
      set({ loading: false, error: e.message, couponResult: null });
      throw e;
    }
  },

  resetCouponResult() {
    set({ couponResult: null, error: null });
  },
}));

export default useCouponStore;
