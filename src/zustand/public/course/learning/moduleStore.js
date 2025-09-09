import { create } from 'zustand';
import useAuthStore from '../../../authStore'; // adjust path if needed

const useModuleStore = create((set) => ({
  loading: false,
  error: null,
  modules: [],
  async fetchModules(courseId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${courseId}/modules`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil modul');
      set({
        modules: json.data,
        loading: false,
        error: null,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },
  reset() {
    set({ loading: false, error: null, modules: [] });
  },
}));

export default useModuleStore;
