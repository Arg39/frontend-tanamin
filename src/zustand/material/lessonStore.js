import { create } from 'zustand';
import useAuthStore from '../authStore';

const useLessonStore = create((set) => ({
  loading: false,
  error: null,
  lessonData: null,

  async addLesson({ moduleId, data }) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/module/${moduleId}/lesson`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah pembelajaran');
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  async fetchLessonDetail(lessonId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/lesson/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Failed to fetch lesson details');
      }
      set({ lessonData: json.data, loading: false, error: null });
    } catch (e) {
      set({ error: e.message || 'An unknown error occurred', loading: false });
      throw e;
    }
  },

  async updateLessonOrder({ id, moveToModule, order }) {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/lesson/updateOrder`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ id, moveToModule, order }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success')
        throw new Error(json.message || 'Failed to update lesson order');
      return json.data;
    } catch (e) {
      throw e;
    }
  },
}));

export default useLessonStore;
