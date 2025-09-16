import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useEnrollmentStore = create((set, get) => ({
  loading: false,
  error: null,
  buyNow: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${
          process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'
        }/api/enrollments/buy-now/${courseId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal melakukan pembelian');
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useEnrollmentStore;
