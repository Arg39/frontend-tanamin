import { create } from 'zustand';
import useAuthStore from '../authStore';

const useNotificationStore = create((set) => ({
  unreadCount: 0,
  notifications: [],
  loading: false,
  error: null,

  async fetchUnreadCount() {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/unread-messages-count`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      const unread = json?.data?.unread_notifications;
      if (res.ok && typeof unread === 'number') {
        set({
          unreadCount: unread,
          loading: false,
          error: null,
        });
      } else {
        set({
          unreadCount: 0,
          loading: false,
          error: json.message || 'Gagal mengambil jumlah notifikasi',
        });
      }
    } catch (e) {
      set({
        unreadCount: 0,
        loading: false,
        error: e.message,
      });
    }
  },

  async fetchNotifications() {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/notifications`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      const notifs = json?.data?.notifications || [];
      if (res.ok) {
        set({
          notifications: notifs,
          loading: false,
          error: null,
        });
      } else {
        set({
          notifications: [],
          loading: false,
          error: json.message || 'Gagal mengambil notifikasi',
        });
      }
    } catch (e) {
      set({
        notifications: [],
        loading: false,
        error: e.message,
      });
    }
  },

  async markAsRead(notificationId) {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/notifications/${notificationId}/mark-as-read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (res.ok) {
        // Perbaiki di sini: ubah is_read menjadi true
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          ),
          loading: false,
          error: null,
        }));
        await useNotificationStore.getState().fetchUnreadCount();
      } else {
        set({
          loading: false,
          error: json.message || 'Gagal menandai notifikasi sebagai telah dibaca',
        });
      }
    } catch (e) {
      set({
        loading: false,
        error: e.message,
      });
    }
  },
}));

export default useNotificationStore;
