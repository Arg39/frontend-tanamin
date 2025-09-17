import { create } from 'zustand';
import useAuthStore from '../../../authStore';

const useCertificateStore = create((set) => ({
  loading: false,
  error: null,
  certificate: null,
  status: null,
  async fetchCertificate(courseId) {
    set({ loading: true, error: null, status: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/certificate/${courseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        set({
          certificate: json.data,
          loading: false,
          error: null,
          status: 'success',
        });
      } else {
        set({
          certificate: null,
          loading: false,
          error: json.message || 'Gagal mengambil sertifikat',
          status: 'failed',
        });
      }
    } catch (e) {
      set({
        certificate: null,
        loading: false,
        error: e.message,
        status: 'failed',
      });
    }
  },
  reset() {
    set({
      loading: false,
      error: null,
      certificate: null,
      status: null,
    });
  },
}));

export default useCertificateStore;
