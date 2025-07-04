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

  // Tambah data atribut kursus
  async addAttribute({ id, type, content }) {
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
          body: JSON.stringify({ type, content }),
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

  // Fetch single attribute detail
  async fetchSingleAttribute({ courseId, attributeId }) {
    set({ attributeLoading: true, attributeError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/attribute/${attributeId}/view`,
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

  // Update attribute
  async updateAttribute({ courseId, attributeId, content, type }) {
    set({ attributeLoading: true, attributeError: null });
    try {
      const token = useAuthStore.getState().token;
      const params = new URLSearchParams({ content, type }).toString();
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/attribute/${attributeId}/update?${params}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
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

  // Delete attribute
  async deleteAttribute({ courseId, attributeId, type }) {
    set({ attributeLoading: true, attributeError: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/attribute/${attributeId}/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
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
