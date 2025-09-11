import { create } from 'zustand';
import axios from 'axios';

const mapAboutUs = (data) => ({
  about: data.about || '',
  vision: data.vision || '',
  mission: Array.isArray(data.mission) ? data.mission : [],
  statistics: Array.isArray(data.statistics) ? data.statistics : [],
});

const defaultAboutUs = {
  about: '',
  vision: '',
  mission: [],
  statistics: [],
};

const useAboutUsStore = create((set, get) => ({
  aboutUs: null,
  loading: false,
  error: null,
  notFound: false,

  activitiesImages: [],
  loadingActivities: false,
  errorActivities: null,

  partnerships: [],
  loadingPartnerships: false,
  errorPartnerships: null,

  fetchAboutUs: async () => {
    set({ loading: true, error: null, notFound: false });
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/profile`);
      if (res.data?.status === 'failed' && res.data?.message === 'Company profile not found') {
        set({ aboutUs: defaultAboutUs, loading: false, notFound: true });
      } else if (res.data?.data) {
        set({ aboutUs: mapAboutUs(res.data.data), loading: false, notFound: false });
      } else {
        set({ error: 'No about us data', loading: false, notFound: false });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch about us',
        loading: false,
        notFound: false,
      });
    }
  },

  fetchActivitiesImages: async () => {
    set({ loadingActivities: true, errorActivities: null });
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/activities`
      );
      // Asumsikan response: { data: [ { src: "...", alt: "..." }, ... ] }
      if (Array.isArray(res.data?.data)) {
        set({ activitiesImages: res.data.data, loadingActivities: false, errorActivities: null });
      } else {
        set({
          activitiesImages: [],
          loadingActivities: false,
          errorActivities: 'No activities images found',
        });
      }
    } catch (err) {
      set({
        activitiesImages: [],
        loadingActivities: false,
        errorActivities: err.response?.data?.message || 'Failed to fetch activities images',
      });
    }
  },

  fetchPartnerships: async () => {
    set({ loadingPartnerships: true, errorPartnerships: null });
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnerships`
      );
      // Asumsikan response: { data: [ { name, logo, description }, ... ] }
      if (Array.isArray(res.data?.data)) {
        set({
          partnerships: res.data.data,
          loadingPartnerships: false,
          errorPartnerships: null,
        });
      } else {
        set({
          partnerships: [],
          loadingPartnerships: false,
          errorPartnerships: 'No partnerships found',
        });
      }
    } catch (err) {
      set({
        partnerships: [],
        loadingPartnerships: false,
        errorPartnerships: err.response?.data?.message || 'Failed to fetch partnerships',
      });
    }
  },
}));

export default useAboutUsStore;
