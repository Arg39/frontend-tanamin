import { create } from 'zustand';
import useAuthStore from './authStore';

const defaultContact = {
  telephone: '',
  email: '',
  address: '',
  social_media: {
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: '',
  },
};

const useCompanyContactStore = create((set, get) => ({
  contact: { ...defaultContact },
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
      if (json.status !== 'success') {
        // If contact not added yet, set default empty contact
        if (json.message === 'Company contact has not been added yet') {
          set({ contact: { ...defaultContact }, loading: false, error: null, fetched: true });
          return defaultContact;
        }
        throw new Error(json.message || 'Failed to fetch contact');
      }
      // Ensure data is not null
      const safeData = {
        telephone: json.data.telephone || '',
        email: json.data.email || '',
        address: json.data.address || '',
        social_media: json.data.social_media || { ...defaultContact.social_media },
      };
      set({ contact: safeData, loading: false, error: null, fetched: true });
      return safeData;
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
