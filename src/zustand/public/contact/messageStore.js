import { create } from 'zustand';

const useMessageStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  async sendMessage({ name, email, subject, message }) {
    set({ loading: true, error: null, success: false });
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/message/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Gagal mengirim pesan');
      set({ loading: false, success: true, error: null });
      return json;
    } catch (e) {
      set({ loading: false, error: e.message, success: false });
      throw e;
    }
  },

  resetStatus() {
    set({ success: false, error: null });
  },
}));

export default useMessageStore;
