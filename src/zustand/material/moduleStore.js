import { create } from 'zustand';
import useAuthStore from '../authStore';

const useModuleStore = create((set, get) => ({
  modules: [],
  loading: false,
  error: null,
  createdModule: null,

  async fetchModules(courseId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/modules`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch modules');

      const modules = Array.isArray(json.data)
        ? json.data.map((m) => ({
            ...m,
            lessons: Array.isArray(m.lessons) ? m.lessons : [],
          }))
        : [];

      set({ modules, loading: false, error: null });
    } catch (e) {
      set({ modules: [], loading: false, error: e.message });
      throw e;
    }
  },

  async getModuleById(moduleId, courseId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/module/${moduleId}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil modul');

      const newModule = {
        ...json.data,
        lessons: Array.isArray(json.data.lessons) ? json.data.lessons : [],
      };

      set((prev) => ({
        modules: Array.isArray(prev.modules)
          ? [
              ...prev.modules.filter((m) => String(m.id) !== String(moduleId)),
              newModule,
            ]
          : [newModule],
        loading: false,
        error: null,
      }));

      return newModule;
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/module`,
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

  async updateModule({ moduleId, courseId, title, order }) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const body = {
        title: (title || '').trim(),
      };
      if (order !== undefined && order !== null && order !== '') {
        body.order = order;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/module/${moduleId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') {
        let errorMsg = json.message;
        if (json.data && json.data.error) {
          errorMsg += ': ' + json.data.error;
        }
        throw new Error(errorMsg || 'Gagal update modul');
      }
      set((state) => ({
        modules: state.modules.map((m) =>
          String(m.id) === String(moduleId) ? { ...m, ...json.data } : m
        ),
        loading: false,
        error: null,
      }));
      return json.data;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  async updateModuleOrder({ id, order }) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/module/updateOrder`,
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
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/course/${courseId}/module/${moduleId}`,
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
        modules: state.modules.filter((m) => String(m.id) !== String(moduleId)),
      }));
      return json;
    } catch (e) {
      throw e;
    }
  },
}));

export default useModuleStore;