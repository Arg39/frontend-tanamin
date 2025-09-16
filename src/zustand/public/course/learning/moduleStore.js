import { create } from 'zustand';
import useAuthStore from '../../../authStore';

const useModuleStore = create((set, get) => ({
  loading: false,
  error: null,
  modules: [],
  status: null,
  hasAccessError: false, // flag to prevent multiple error toasts

  async fetchModules(courseId, onAccessError) {
    set({ loading: true, error: null, status: null, hasAccessError: false });
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

      if (json.status === 'success') {
        set({
          modules: json.data,
          loading: false,
          error: null,
          status: 'success',
          hasAccessError: false,
        });
      } else {
        if (!get().hasAccessError) {
          set({
            loading: false,
            status: 'failed',
            error: json.message || 'Gagal',
            hasAccessError: true,
          });
          if (onAccessError) onAccessError(json.message || 'Gagal');
        }
      }
    } catch (e) {
      if (!get().hasAccessError) {
        set({ error: e.message, loading: false, status: 'failed', hasAccessError: true });
        if (onAccessError) onAccessError(e.message);
      }
    }
  },

  async saveLessonProgress(lessonId) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/lesson/progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ lesson_id: lessonId }),
        }
      );
      const json = await res.json();
      return json;
    } catch (e) {
      return { status: 'failed', message: e.message };
    }
  },

  async reloadModules(courseId) {
    await get().fetchModules(courseId);
  },

  reset() {
    set({ loading: false, error: null, modules: [], status: null, hasAccessError: false });
  },
}));

export default useModuleStore;
