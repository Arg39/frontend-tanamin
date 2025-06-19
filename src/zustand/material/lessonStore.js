import { create } from 'zustand';
import useAuthStore from '../authStore';

const useLessonStore = create((set) => ({
  loading: false,
  error: null,
  lessonData: null,

  async addLesson({ courseId, moduleId, data }) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/${courseId}/module/${moduleId}/material`,
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
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menambah materi');
      set({ loading: false, error: null });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  async fetchLessonDetail(lessonId) {
    console.log('try fetching lesson detail for ID:', lessonId);
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/instructor/course/material/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('Response JSON:', json);
      if (json.status !== 'success') {
        throw new Error(json.message || 'Failed to fetch lesson details');
      }
      set({ lessonData: json.data, loading: false, error: null });
    } catch (e) {
      console.error('Error fetching lesson detail:', e.message);
      set({ error: e.message || 'An unknown error occurred', loading: false });
      throw e; // Tetap lempar error agar bisa ditangani di komponen
    }
  },
}));

export default useLessonStore;
