import React from 'react';
import Template from '../template/template';
import GradientText from '../blocks/TextAnimations/FuzzyText/gradientColors';
import Card from '../components/card/card';
import useCourseStore from '../zustand/courseStore';
import StackedCards from '../components/card/stackedCards';

export default function Beranda2() {
  const course = useCourseStore((state) => state.course); // Access the course from the store

  return (
    <Template
      activeNav="beranda"
      className="h-screen w-screen bg-gradient-to-t from-primary-400 from-0% via-primary-200 via-50% to-white-100 to-100%"
    >
      <div className="xl:p-20 lg:p-10 md:p-14 sm:p-8 p-8 w-full">
        <p className="p-2 px-4 rounded-full bg-primary-800 items-center max-w-fit text-xl text-white-100">
          Welcome to Course Tanamin
        </p>
        <div className="mt-16 gap-8 w-full flex">
          <div className="flex flex-col w-1/2">
            <h1 className="text-5xl font-semibold">
              Platform{' '}
              <GradientText
                className="bg-gradient-to-r from-primary-700 via-secondary-500 to-accent-800"
                duration={6}
                fontSize="3rem"
              >
                Online Course
              </GradientText>{' '}
              Terbaik Untuk Mendorong Karir Anda
            </h1>
            <p className="text-4xl font-extralight mt-8">
              Jelajahi course terbaik dengan materi berkualitas dan instruktur profesional
            </p>
          </div>
          <div className="relative flex w-1/2 justify-center items-start">
            <StackedCards course={course} count={3} />
          </div>
        </div>
      </div>
    </Template>
  );
}
