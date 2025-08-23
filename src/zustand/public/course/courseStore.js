import { create } from 'zustand';
import axios from 'axios';

const useCourseStore = create((set) => ({
  course: null,
  error: null,
  loading: false,
  attribute: null,
  attributeLoading: false,
  attributeError: null,
  material: null,
  materialLoading: false,
  materialError: null,
  instructor: null,
  instructorLoading: false,
  instructorError: null,
  othersCourseInstructor: [],
  othersCourseInstructorLoading: false,
  othersCourseInstructorError: null,
  instructorCourses: [],
  instructorCoursesLoading: false,
  instructorCoursesError: null,

  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${id}`
      );
      if (response.status === 200) {
        set({ course: response.data.data, loading: false });
      } else {
        set({ error: 'Gagal mengambil data kursus', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Gagal mengambil data kursus',
        loading: false,
      });
    }
  },

  fetchAttributeByCourseId: async (courseId) => {
    set({ attributeLoading: true, attributeError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/${courseId}/attribute`
      );
      if (response.status === 200) {
        set({ attribute: response.data.data, attributeLoading: false });
      } else {
        set({ attributeError: 'Gagal mengambil data attribute', attributeLoading: false });
      }
    } catch (error) {
      set({
        attributeError: error.response?.data?.message || 'Gagal mengambil data attribute',
        attributeLoading: false,
      });
    }
  },

  fetchMaterialByCourseId: async (courseId) => {
    set({ materialLoading: true, materialError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/${courseId}/material`
      );
      if (response.status === 200) {
        set({ material: response.data.data, materialLoading: false });
      } else {
        set({ materialError: 'Gagal mengambil data materi', materialLoading: false });
      }
    } catch (error) {
      set({
        materialError: error.response?.data?.message || 'Gagal mengambil data materi',
        materialLoading: false,
      });
    }
  },

  fetchInstructorByCourseId: async (courseId) => {
    set({ instructorLoading: true, instructorError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/${courseId}/instructor`
      );
      if (response.status === 200) {
        set({ instructor: response.data.data, instructorLoading: false });
      } else {
        set({ instructorError: 'Gagal mengambil data instruktur', instructorLoading: false });
      }
    } catch (error) {
      set({
        instructorError: error.response?.data?.message || 'Gagal mengambil data instruktur',
        instructorLoading: false,
      });
    }
  },

  fetchOthersCourseInstructor: async (courseId) => {
    set({ othersCourseInstructorLoading: true, othersCourseInstructorError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/${courseId}/other-instructor-courses`
      );
      if (response.status === 200) {
        set({ othersCourseInstructor: response.data.data, othersCourseInstructorLoading: false });
      } else {
        set({
          othersCourseInstructorError: 'Gagal mengambil kursus lain instruktur',
          othersCourseInstructorLoading: false,
        });
      }
    } catch (error) {
      set({
        othersCourseInstructorError:
          error.response?.data?.message || 'Gagal mengambil kursus lain instruktur',
        othersCourseInstructorLoading: false,
      });
    }
  },

  fetchCoursesByInstructorId: async (instructorId) => {
    set({ instructorCoursesLoading: true, instructorCoursesError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/instructor-courses/${instructorId}`
      );
      if (response.status === 200) {
        set({ instructorCourses: response.data.data, instructorCoursesLoading: false });
      } else {
        set({
          instructorCoursesError: 'Gagal mengambil kursus instruktur',
          instructorCoursesLoading: false,
        });
      }
    } catch (error) {
      set({
        instructorCoursesError:
          error.response?.data?.message || 'Gagal mengambil kursus instruktur',
        instructorCoursesLoading: false,
      });
    }
  },
}));

export default useCourseStore;
