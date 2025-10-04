import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from '../authStore';

const useBookmarkStore = create((set) => ({
  bookmarks: [],
  loading: false,
  error: null,
  async fetchBookmarks(token) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/bookmarked`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ bookmarks: response.data.data.courses || [], loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  },
  bookmarkLoading: {},
  async removeBookmark(courseId) {
    set((state) => ({
      bookmarkLoading: { ...state.bookmarkLoading, [courseId]: true },
    }));
    try {
      const token = useAuthStore.getState().token;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/bookmark/${courseId}/remove`;
      await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        bookmarks: state.bookmarks.filter((c) => c.id !== courseId),
        bookmarkLoading: { ...state.bookmarkLoading, [courseId]: false },
      }));
    } catch (err) {
      set((state) => ({
        bookmarkLoading: { ...state.bookmarkLoading, [courseId]: false },
      }));
    }
  },
}));

export default useBookmarkStore;
