import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const mapProfileData = (data) => ({
  id: data.id,
  role: data.role,
  first_name: data.first_name,
  last_name: data.last_name,
  username: data.username,
  email: data.email,
  telephone: data.telephone,
  status: data.status,
  photo: data.photo_profile,
  expertise: data.detail?.expertise,
  about: data.detail?.about,
  social_media: Array.isArray(data.detail?.social_media)
    ? data.detail.social_media
    : data.detail?.social_media
    ? JSON.parse(data.detail.social_media)
    : [],
});

const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        set({ profile: mapProfileData(res.data.data), loading: false });
      } else {
        set({ error: 'No profile data', loading: false });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch profile',
        loading: false,
      });
    }
  },
}));

export default useProfileStore;
