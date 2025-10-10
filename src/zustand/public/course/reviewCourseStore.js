import { create } from 'zustand';
import useAuthStore from '../../authStore';

const useReviewCourseStore = create((set, get) => ({
  loading: false,
  error: null,
  review: null,
  fetchReview: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${courseId}/reviews`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengambil review');
      // Handle array response
      const reviewData = Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null;
      set({ review: reviewData, loading: false, error: null });
      return reviewData;
    } catch (e) {
      set({ error: e.message, loading: false, review: null });
      throw e;
    }
  },
  submitReview: async (courseId, rating, comment) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${courseId}/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            rating,
            comment: comment || '',
          }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengirim review');
      set({ loading: false, error: null });
      // After submit, fetch review again
      await get().fetchReview(courseId);
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useReviewCourseStore;
