import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const mapCompanyProfile = (data) => ({
  about: data.about || '',
  vision: data.vision || '',
  mission: data.mission || '',
  statistics: Array.isArray(data.statistics) ? data.statistics : [],
});

const defaultProfile = {
  about: '',
  vision: '',
  mission: '',
  statistics: [],
};

const useCompanyStore = create((set, get) => ({
  companyProfile: null,
  loading: false,
  error: null,
  notFound: false,
  notFound: false,

  fetchCompanyProfile: async () => {
    set({ loading: true, error: null, notFound: false });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Jika status failed dan message "Company profile not found"
      if (res.data?.status === 'failed' && res.data?.message === 'Company profile not found') {
        set({ companyProfile: defaultProfile, loading: false, notFound: true });
      } else if (res.data?.data) {
        set({ companyProfile: mapCompanyProfile(res.data.data), loading: false, notFound: false });
      } else {
        set({ error: 'No company profile data', loading: false, notFound: false });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch company profile',
        loading: false,
        notFound: false,
      });
    }
  },

  saveCompanyProfile: async (profileData) => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.data) {
        set({ companyProfile: mapCompanyProfile(res.data.data), loading: false });
      } else {
        set({ error: 'Gagal menyimpan profil perusahaan', loading: false });
      }
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal menyimpan profil perusahaan',
        loading: false,
      });
      throw err;
    }
  },
}));

export default useCompanyStore;
