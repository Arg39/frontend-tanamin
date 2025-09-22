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
  fetchedActivities: false,

  partnerships: [],
  loadingPartnerships: false,
  errorPartnerships: null,
  fetchedPartnerships: false,

  fetchAboutUs: async () => {
    set({ loading: true, error: null, notFound: false });
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/profile`);
      if (res.data?.status === 'failed') {
        set({ aboutUs: null, loading: false, notFound: true });
      } else if (res.data?.data) {
        set({ aboutUs: mapAboutUs(res.data.data), loading: false, notFound: false });
      } else {
        set({ aboutUs: null, error: 'No about us data', loading: false, notFound: true });
      }
    } catch (err) {
      set({
        aboutUs: null,
        error: err.response?.data?.message || 'Failed to fetch about us',
        loading: false,
        notFound: true,
      });
    }
  },

  fetchActivitiesImages: async () => {
    if (get().fetchedActivities) return;
    set({ loadingActivities: true, errorActivities: null });
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/activities`
      );
      if (res.data?.status === 'failed') {
        set({
          activitiesImages: [],
          loadingActivities: false,
          errorActivities: null,
          fetchedActivities: true,
        });
      } else if (Array.isArray(res.data?.data)) {
        set({
          activitiesImages: res.data.data,
          loadingActivities: false,
          errorActivities: null,
          fetchedActivities: true,
        });
      } else {
        set({
          activitiesImages: [],
          loadingActivities: false,
          errorActivities: 'No activities images found',
          fetchedActivities: true,
        });
      }
    } catch (err) {
      set({
        activitiesImages: [],
        loadingActivities: false,
        errorActivities: err.response?.data?.message || 'Failed to fetch activities images',
        fetchedActivities: true,
      });
    }
  },

  fetchPartnerships: async () => {
    if (get().fetchedPartnerships) return;
    set({ loadingPartnerships: true, errorPartnerships: null });
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/company/partnerships`
      );
      if (res.data?.status === 'failed') {
        set({
          partnerships: [],
          loadingPartnerships: false,
          errorPartnerships: null,
          fetchedPartnerships: true,
        });
      } else if (Array.isArray(res.data?.data)) {
        set({
          partnerships: res.data.data,
          loadingPartnerships: false,
          errorPartnerships: null,
          fetchedPartnerships: true,
        });
      } else {
        set({
          partnerships: [],
          loadingPartnerships: false,
          errorPartnerships: 'No partnerships found',
          fetchedPartnerships: true,
        });
      }
    } catch (err) {
      set({
        partnerships: [],
        loadingPartnerships: false,
        errorPartnerships: err.response?.data?.message || 'Failed to fetch partnerships',
        fetchedPartnerships: true,
      });
    }
  },
}));

export default useAboutUsStore;
