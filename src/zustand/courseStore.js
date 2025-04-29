import { create } from 'zustand';

const useCourseStore = create((set) => ({
  course: {
    image:
      'https://cpr.heart.org/-/media/CPR-Images/Find-a-Course/AHA-IAN-3940-HiRes-find-a-course.jpg?h=641&iar=0&mw=960&w=960&sc_lang=en',
    title: 'Full Stack JavaScript Next JS Developer: Build Job Portal Website ',
    rating: 4,
    lotMaterial: 3,
    duration: 4,
    participant: 100,
    instructor: 'John Doe',
    price: 199000,
    priceBeforeDiscount: 399000,
    categry: 'Fullstack',
  },
  setCourse: (newCourse) => set({ course: newCourse }),
}));

export default useCourseStore;
