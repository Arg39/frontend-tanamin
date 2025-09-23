import React, { useEffect, useState } from 'react';
import Template from '../../template/template';
import GradientText from '../../blocks/TextAnimations/FuzzyText/gradientColors';
import useCourseStore from '../../zustand/public/course/courseStore';
import Button from '../../components/button/button';
import { useLocation, useNavigate } from 'react-router-dom';
import useCategoryStore from '../../zustand/categoryStore';
import CategoryCard from '../../components/card/categoryCard';
import InstructorCarousel from '../../components/carousel/InstructorCarousel';
import Card from '../../components/card/card';
import Icon from '../../components/icons/icon';
import useInstructorStore from '../../zustand/public/course/instructorStore';
import useBerandaStore from '../../zustand/public/beranda/berandaStore';
import StackedCourseCards from '../../components/card/stackedCards'; // Import here

// Helper to get full image URL
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${image}`;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default function Beranda() {
  const location = useLocation();
  const { categories, fetchCategories } = useCategoryStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { instructors, loading, error, fetchInstructors } = useInstructorStore();
  const { courses, coursesLoading, coursesError, fetchCourses } = useCourseStore();

  // Best courses store
  const { bestCourses, bestCoursesLoading, bestCoursesError, fetchBestCourses } = useBerandaStore();

  useEffect(() => {
    fetchCategories({ perPage: 8 });
  }, [fetchCategories]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchBestCourses();
  }, [fetchBestCourses]);

  const handleCategoryClick = (category) => {
    // TODO: Implementasi pencarian berdasarkan kategori
    console.log('Cari kategori:', category);
  };

  // Map backend instructor data to carousel format
  const mappedInstructors = Array.isArray(instructors)
    ? instructors.map((inst) => ({
        id: inst.id,
        image: getImageUrl(inst.photo_profile),
        name: inst.name,
        expertise: inst.expertise,
        courseCount: inst.course_held,
      }))
    : [];

  return (
    <Template
      activeNav="beranda"
      className="h-screen w-full bg-gradient-to-t from-primary-300 from-0% via-primary-100 via-50% to-white to-100%"
      locationKey={location.key}
    >
      <div className="xl:px-20 lg:px-10 md:px-14 sm:px-8 px-6 pt-8 w-full">
        <div className="mt-16 gap-8 w-full flex flex-col lg:flex-row">
          {/* Left side */}
          <div className="flex flex-col w-full lg:w-1/2">
            <h3 className="p-2 px-4 rounded-full bg-primary-200 text-primary-900 font-medium items-center max-w-fit text-lg lg:text-xl">
              Welcome to Course Tanamin
            </h3>
            <h1 className="text-3xl lg:text-4xl font-semibold mt-16 lg:mt-32">
              Platform{' '}
              <GradientText
                className="bg-gradient-to-r from-primary-600 to-tertiary-500"
                total_quiz={6}
                fontSize="2rem lg:2.5rem"
              >
                Online Course
              </GradientText>{' '}
              Terbaik Untuk Mendorong Karir Anda
            </h1>
            <p className="text-xl lg:text-3xl font-extralight mt-8 lg:mt-16">
              Jelajahi course terbaik dengan materi berkualitas dan instruktur profesional
            </p>
            <Button
              variant="primary"
              className="font-medium bg-primary-700 text-white text-base lg:text-lg mt-8 lg:mt-16 w-fit px-6 lg:px-8"
              to="/kursus"
            >
              Jelajahi Course
            </Button>
          </div>

          {/* Right side: Stacked Cards */}
          <div
            className="w-full lg:w-1/2 flex justify-center items-center min-h-[22rem] sm:min-h-[26rem] relative"
            style={{ overflow: 'visible', paddingTop: '2.5rem' }}
          >
            {bestCoursesLoading ? (
              <div className="text-primary-600">Loading...</div>
            ) : bestCoursesError ? (
              <div className="text-red-600">{bestCoursesError}</div>
            ) : (
              <div
                className="flex sm:justify-center items-center w-full"
                style={{ overflow: 'visible' }}
              >
                <StackedCourseCards courses={bestCourses} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 lg:mt-32 w-full bg-white">
        <div className="xl:p-20 lg:p-10 md:p-8 sm:p-6 p-4">
          <div className="mb-16">
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">Kategori Populer</h2>
            <div className="mt-8 mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full place-items-start">
                {(isMobile ? categories.slice(0, 4) : categories.slice(0, 8)).map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={{
                      ...cat,
                      imageUrl: getImageUrl(cat.image),
                    }}
                    onClick={() => handleCategoryClick(cat)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* <div className="mb-16">
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">
              Teratas Minggu Ini
            </h2>
            <div className="mb-20"></div>
          </div> */}

          <div className="mb-16">
            <div className="flex justify-between items-end">
              <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">
                Instruktur Kami
              </h2>
              <button
                onClick={() => navigate('/instruktur')}
                className="flex items-center text-primary-700 hover:underline transition-colors font-medium text-sm lg:text-base"
              >
                Selengkapnya
                <Icon type="arrow-right" className="w-4 h-4 ml-1" />
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-primary-600">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <InstructorCarousel instructors={mappedInstructors} />
            )}
          </div>

          <div className="mb-16">
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">
              Temukan Course Sesuai Bidang Anda
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {coursesLoading ? (
                <div className="col-span-4 text-center py-8 text-primary-600">
                  Loading courses...
                </div>
              ) : coursesError ? (
                <div className="col-span-4 text-center py-8 text-red-600">{coursesError}</div>
              ) : courses && courses.length > 0 ? (
                courses.map((course) => <Card key={course.id} course={course} />)
              ) : (
                <div className="col-span-4 text-center py-8 text-primary-600">
                  Tidak ada course tersedia.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}
