import { create } from 'zustand';
import useAuthStore from '../../../authStore';

const useLessonStore = create((set) => ({
  loading: false,
  error: null,
  lesson: null,
  status: null,
  async fetchLesson(lessonId) {
    set({ loading: true, error: null, status: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/lesson/${lessonId}`,
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
          lesson: json.data,
          loading: false,
          error: null,
          status: 'success',
        });
      } else {
        set({ loading: false, status: 'failed', error: json.message || 'Gagal' });
      }
    } catch (e) {
      set({ error: e.message, loading: false, status: 'failed' });
    }
  },
  reset() {
    set({ loading: false, error: null, lesson: null, status: null });
  },
}));

export default useLessonStore;
