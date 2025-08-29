import { create } from 'zustand';
import useAuthStore from './authStore';

const useCompanyContactStore = create((set, get) => ({
  contact: {
    telephone: '',
    email: '',
    address: '',
    social_media: {
      instagram: '',
      facebook: '',
      linkedin: '',
      twitter: '',
    },
  },
  loading: false,
  error: null,
  fetched: false,

  fetchContact: async () => {
    if (get().fetched) return get().contact;
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/contact`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Failed to fetch contact');
      set({ contact: json.data, loading: false, error: null, fetched: true });
      return json.data;
    } catch (e) {
      set({ error: e.message, loading: false, fetched: false });
      throw e;
    }
  },

  updateContact: async ({ telephone, email, address, social_media }) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const body = JSON.stringify({
        telephone,
        email,
        address,
        social_media,
      });
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal menyimpan kontak');
      set({ contact: json.data, loading: false, error: null, fetched: true });
      return json;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },
}));

export default useCompanyContactStore;
