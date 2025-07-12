import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';
import { toast } from 'react-toastify';

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
  photo_cover: data.detail?.photo_cover || null,
  expertise: data.detail?.expertise,
  about: data.detail?.about,
  social_media: Array.isArray(data.detail?.social_media)
    ? data.detail.social_media
    : data.detail?.social_media
    ? JSON.parse(data.detail.social_media)
    : [],
  profile: null,
  loading: false,
  error: null,
});

const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  userProfile: null,
  userProfileLoading: false,
  userProfileError: null,

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

  updateProfile: async (formData) => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (res.data?.data) {
        set({ profile: mapProfileData(res.data.data), loading: false });
      } else {
        set({ error: 'No profile data', loading: false });
        toast.error('No profile data');
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update profile',
        loading: false,
      });
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  },

  fetchUserProfileById: async (id) => {
    set({ userProfileLoading: true, userProfileError: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user-profile/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.data) {
        set({ userProfile: mapProfileData(res.data.data), userProfileLoading: false });
      } else {
        set({ userProfileError: 'No user profile data', userProfileLoading: false });
      }
    } catch (err) {
      set({
        userProfileError: err.response?.data?.message || 'Failed to fetch user profile',
        userProfileLoading: false,
      });
    }
  },
}));

export default useProfileStore;
