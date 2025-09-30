import { create } from 'zustand';
import useAuthStore from './authStore';

const useCourseAttributeStore = create((set, get) => ({
  attribute: null,
  attributeLoading: false,
  attributeError: null,

  // Fetch course attributes
  async fetchAttribute({ id }) {
    set({ attributeLoading: true, attributeError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}/attribute`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Gagal mengambil atribut kursus');
      set({
        attribute: json.data,
        attributeLoading: false,
        attributeError: null,
      });
    } catch (e) {
      set({
        attribute: null,
        attributeLoading: false,
        attributeError: e.message,
      });
    }
  },

  // Tambah banyak atribut sekaligus (baru)
  async addAttributesBulk({ id, attributes, benefits, prerequisites }) {
    set({ attributeLoading: true, attributeError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${id}/attribute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            attributes,
            benefits,
            prerequisites,
          }),
        }
      );
      const json = await res.json();
      set({ attributeLoading: false });
      return json;
    } catch (e) {
      set({ attributeLoading: false, attributeError: e.message });
      return { status: 'error', message: e.message };
    }
  },
}));

export default useCourseAttributeStore;
