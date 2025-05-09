import React from 'react';
import Template from '../template/template';
import GradientText from '../blocks/TextAnimations/FuzzyText/gradientColors';
import useCourseStore from '../zustand/courseStore';
import StackedCards from '../components/card/stackedCards';
import Button from '../components/button/button';

export default function Beranda2() {
  const course = useCourseStore((state) => state.course);

  return (
    <Template
      activeNav="beranda"
      className="h-screen w-screen bg-gradient-to-t from-primary-300 from-0% via-primary-100 via-50% to-white-100 to-100%"
    >
      <div className="xl:p-20 lg:p-10 md:p-14 sm:p-8 p-8 w-full">
        <div className="mt-16 gap-8 w-full flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-1/2">
            <h3 className="p-2 px-4 rounded-full bg-primary-400 text-primary-900 font-medium items-center max-w-fit text-lg lg:text-xl">
              Welcome to Course Tanamin
            </h3>
            <h1 className="text-3xl lg:text-4xl font-semibold mt-16 lg:mt-32">
              Platform{' '}
              <GradientText
                className="bg-gradient-to-r from-primary-700 via-secondary-500 to-accent-800"
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
              className="text-base lg:text-lg mt-8 lg:mt-16 w-fit px-6 lg:px-8"
              to="/course"
            >
              Jelajahi Course
            </Button>
          </div>
          <div className="flex w-full lg:w-1/2 mt-8 lg:mt-[-2.5rem] justify-center items-start">
            <StackedCards course={course} count={3} />
          </div>
        </div>
      </div>
      <div className="mt-16 lg:mt-32 w-screen bg-white-100">
        <div className="xl:p-20 lg:p-10 md:p-8 sm:p-6 p-4">
          <h2 className="text-2xl lg:text-4xl font-semibold">Kategori Populer</h2>
        </div>
      </div>
    </Template>
  );
}
