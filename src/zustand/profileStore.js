import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';
import { toast } from 'react-toastify';

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
        set({ profile: res.data.data, loading: false });
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
        set({ profile: res.data.data, loading: false });
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

  updatePassword: async (newPassword) => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/password`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal mengubah password',
        loading: false,
      });
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
      throw err;
    }
  },

  fetchUserProfileById: async (id) => {
    set({ userProfileLoading: true, userProfileError: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        set({ userProfile: res.data.data, userProfileLoading: false });
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

  updateUserStatus: async (id, status) => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Status berhasil diubah');
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal mengubah status',
        loading: false,
      });
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
      throw err;
    }
  },

  deleteUserProfile: async (id) => {
    set({ loading: true, error: null });
    const { token } = useAuthStore.getState();
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ userProfile: null, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Gagal menghapus profil',
        loading: false,
      });
      toast.error(err.response?.data?.message || 'Gagal menghapus profil');
      throw err;
    }
  },
}));

export default useProfileStore;
