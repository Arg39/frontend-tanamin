import { create } from 'zustand';
import useAuthStore from '../authStore';

const useModuleStore = create((set) => ({
  modules: [],
  loading: false,
  error: null,
  createdModule: null,

  async fetchModules(courseId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/${courseId}/modules`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch modules');
      set({ modules: json.data, loading: false, error: null });
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  async addModule({ courseId, title }) {
    set({ loading: true, error: null, createdModule: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();
      formData.append('title', title);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/${courseId}/module`,
        {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Do not set Content-Type, browser will set it for multipart/form-data
          },
          body: formData,
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah modul');
      set({ loading: false, createdModule: json.data, error: null });
      return json;
    } catch (e) {
      set({ loading: false, error: e.message, createdModule: null });
      throw e;
    }
  },

  async updateModuleOrder({ id, order }) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/module/updateOrder`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ id, order }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to update order');
      return json.data;
    } catch (e) {
      throw e;
    }
  },

  async deleteModule({ courseId, moduleId }) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/${courseId}/module/${moduleId}`,
        {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menghapus modul');
      // Remove module from state
      set((state) => ({
        modules: state.modules.filter((m) => m.id !== moduleId),
      }));
      return json;
    } catch (e) {
      throw e;
    }
  },
}));

export default useModuleStore;
