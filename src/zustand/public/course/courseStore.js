import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from '../../authStore';

function buildFilterParams(filters) {
  const params = {};
  if (!filters) return params;
  if (filters.categories && filters.categories.length > 0) {
    params['categories'] = filters.categories;
  }
  if (filters.instructor && filters.instructor.length > 0) {
    params['instructor'] = filters.instructor;
  }
  if (filters.ratings && filters.ratings.length > 0) {
    params['ratings'] = filters.ratings;
  }
  if (filters.price) {
    params['price'] = filters.price;
  }
  if (filters.level) {
    params['level'] = filters.level;
  }
  return params;
}

const useCourseStore = create((set) => ({
  courses: [],
  coursesError: null,
  coursesLoading: false,
  pagination: null,
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
  access: false,
  courseRatings: null,
  courseRatingsLoading: false,
  courseRatingsError: null,
  myCourses: [],
  myCoursesLoading: false,
  myCoursesError: null,
  bookmarkLoading: {},

  setCourseInCart: (inCart) => {
    set((state) => ({
      course: state.course ? { ...state.course, in_cart: inCart } : state.course,
    }));
  },

  fetchCourses: async ({ page = 1, search = '', filters = {} } = {}) => {
    set({ coursesLoading: true, coursesError: null });
    try {
      const filterParams = buildFilterParams(filters);
      const params = {
        page,
        search,
        ...filterParams,
      };
      const token = useAuthStore.getState().token;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses`,
        {
          params,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.status === 200) {
        set({
          courses: response.data.data.items,
          pagination: response.data.data.pagination,
          coursesLoading: false,
        });
      } else {
        set({ coursesError: 'Failed to fetch courses', coursesLoading: false });
      }
    } catch (error) {
      set({
        coursesError: error.response?.data?.message || 'Failed to fetch courses',
        coursesLoading: false,
      });
    }
  },

  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-course/${id}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (response.status === 200) {
        const courseData = response.data.data;
        set({
          course: courseData,
          access: courseData.access || false,
          loading: false,
        });
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

  fetchRatingsByCourseId: async (courseId) => {
    set({ courseRatingsLoading: true, courseRatingsError: null });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/${courseId}/ratings`
      );
      if (response.status === 200) {
        set({
          courseRatings: response.data.data,
          courseRatingsLoading: false,
        });
      } else {
        set({
          courseRatingsError: 'Gagal mengambil data rating kursus',
          courseRatingsLoading: false,
        });
      }
    } catch (error) {
      set({
        courseRatingsError: error.response?.data?.message || 'Gagal mengambil data rating kursus',
        courseRatingsLoading: false,
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

  fetchMyCourses: async (status = 'enrolled') => {
    set({ myCoursesLoading: true, myCoursesError: null });
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/tanamin-courses/my-courses`,
        {
          params: { filter: status }, // Ubah dari 'status' ke 'filter'
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (response.status === 200) {
        set({
          myCourses: response.data.data.courses,
          myCoursesLoading: false,
        });
      } else {
        set({
          myCoursesError: 'Gagal mengambil data kursus saya',
          myCoursesLoading: false,
        });
      }
    } catch (error) {
      set({
        myCoursesError: error.response?.data?.message || 'Gagal mengambil data kursus saya',
        myCoursesLoading: false,
      });
    }
  },

  toggleBookmark: async (courseId, currentStatus) => {
    set((state) => ({
      bookmarkLoading: { ...state.bookmarkLoading, [courseId]: true },
    }));
    try {
      const token = useAuthStore.getState().token;
      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/bookmark/${courseId}/${
        currentStatus ? 'remove' : 'add'
      }`;
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (response.data?.status === 'success') {
        // Update courses array
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, bookmark: !currentStatus } : c
          ),
          // Update course detail if open
          course:
            state.course && state.course.id === courseId
              ? { ...state.course, bookmark: !currentStatus }
              : state.course,
        }));
      }
    } catch (e) {
      // Optionally: handle error (toast, etc)
    } finally {
      set((state) => ({
        bookmarkLoading: { ...state.bookmarkLoading, [courseId]: false },
      }));
    }
  },
}));

export default useCourseStore;
