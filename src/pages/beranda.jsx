import React, { useEffect } from 'react';
import Template from '../template/template';
import GradientText from '../blocks/TextAnimations/FuzzyText/gradientColors';
import useCourseStore from '../zustand/courseStore';
import Button from '../components/button/button';
import { useLocation } from 'react-router-dom';
import useCategoryStore from '../zustand/categoryStore';
import CategoryCard from '../components/card/categoryCard';
import InstructorCarousel from '../components/carousel/InstructorCarousel';

// Custom hook to detect if device is mobile
function useIsMobile() {
  // 640px is Tailwind's 'sm' breakpoint
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

export default function Beranda2() {
  const location = useLocation();
  const { categories, fetchCategories } = useCategoryStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchCategories({ perPage: 8 });
  }, [fetchCategories]);

  // Helper to get full image URL
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${image}`;
  };

  const handleCategoryClick = (category) => {
    // TODO: Implementasi pencarian berdasarkan kategori
    console.log('Cari kategori:', category);
  };

  const instructors = [
    {
      id: 1,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'Budi Santoso',
      expertise: 'Data Science',
      courseCount: 5,
    },
    {
      id: 2,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 3,
    },
    {
      id: 3,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 3,
    },
    {
      id: 4,
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 2,
    },
    {
      id: 5,
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 2,
    },
    {
      id: 6,
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 2,
    },
    {
      id: 8,
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 2,
    },
    {
      id: 10,
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
      name: 'Siti Aminah',
      expertise: 'UI/UX Design',
      courseCount: 2,
    },
    // ...tambahkan instruktur lain
  ];

  return (
    <Template
      activeNav="beranda"
      className="h-screen w-screen bg-gradient-to-t from-primary-300 from-0% via-primary-100 via-50% to-white to-100%"
      locationKey={location.key}
    >
      <div className="xl:px-20 lg:px-10 md:px-14 sm:px-8 px-8 pt-8 w-full">
        <div className="mt-16 gap-8 w-full flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-1/2">
            <h3 className="p-2 px-4 rounded-full bg-primary-200 text-primary-900 font-medium items-center max-w-fit text-lg lg:text-xl">
              Welcome to Course Tanamin
            </h3>
            <h1 className="text-3xl lg:text-4xl font-semibold mt-16 lg:mt-32">
              Platform{' '}
              <GradientText
                className="bg-gradient-to-r from-primary-600 to-tertiary-500"
                duration={6}
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
              to="/course"
            >
              Jelajahi Course
            </Button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[20rem]">
            {/* Stacked cards with bottom-right corners joined */}
            <div className="relative w-56 h-80 flex justify-start items-center">
              <div className="absolute w-40 h-64 bg-green-600 shadow-lg rounded-lg transform translate-y-[10px] z-20"></div>
              <div className="absolute w-40 h-64 bg-red-600 shadow-lg rounded-lg transform rotate-[4deg] translate-x-[8px] translate-y-[5px] z-10"></div>
              <div className="absolute w-40 h-64 bg-yellow-600 shadow-lg rounded-lg transform rotate-[8deg] translate-x-[16px] translate-y-[1px] z-0"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 lg:mt-32 w-full bg-white">
        <div className="xl:p-20 lg:p-10 md:p-8 sm:p-6 p-4">
          <div className="mb-16">
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">Kategori Populer</h2>
            <div className="mt-8 mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full place-items-center">
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
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">Instruktur Kami</h2>
            <InstructorCarousel instructors={instructors} />
          </div>

          <div className="mb-16">
            <h2 className="text-xl text-primary-800 lg:text-4xl font-semibold">
              Temukan Course Sesuai Bidang Anda
            </h2>
          </div>
        </div>
      </div>
    </Template>
  );
}
