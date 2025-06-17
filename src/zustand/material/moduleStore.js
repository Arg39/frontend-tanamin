import { create } from 'zustand';
import useAuthStore from '../authStore';

const useModuleStore = create((set) => ({
  loading: false,
  error: null,
  createdModule: null,

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
}));

export default useModuleStore;
