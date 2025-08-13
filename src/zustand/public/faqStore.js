import { create } from 'zustand';
import axios from 'axios';

const useFaqStore = create((set) => ({
  faqList: [],
  loading: false,
  error: null,

  fetchFaq: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/faq-tanamin`);
      if (response.status === 200) {
        set({ faqList: response.data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch FAQ', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch FAQ',
        loading: false,
      });
    }
  },
}));

export default useFaqStore;
