import { create } from 'zustand';
import useAuthStore from '../../../authStore';

const useLessonStore = create((set) => ({
  loading: false,
  error: null,
  lesson: null,
  status: null,
  submitLoading: false,
  submitError: null,
  submitStatus: null,
  async fetchLesson(lessonId) {
    set({ loading: true, error: null, status: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/lesson/${lessonId}/material`,
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
  async fetchQuizLesson(lessonId) {
    set({ loading: true, error: null, status: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/lesson/${lessonId}/quiz`,
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
          lesson: { ...json.data, type: 'quiz' }, // Ensure type is set
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

  async submitQuizAnswers(lessonId, answer) {
    set({ submitLoading: true, submitError: null, submitStatus: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/lesson/${lessonId}/quiz/answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ answer }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        set({
          submitLoading: false,
          submitError: null,
          submitStatus: 'success',
        });
      } else {
        set({
          submitLoading: false,
          submitError: json.message || 'Gagal submit quiz',
          submitStatus: 'failed',
        });
      }
      return json;
    } catch (e) {
      set({
        submitLoading: false,
        submitError: e.message,
        submitStatus: 'failed',
      });
      return { status: 'failed', message: e.message };
    }
  },

  reset() {
    set({
      loading: false,
      error: null,
      lesson: null,
      status: null,
      submitLoading: false,
      submitError: null,
      submitStatus: null,
    });
  },
}));

export default useLessonStore;
