import React from 'react';
import Template from '../template/template';
import GradientText from '../blocks/TextAnimations/FuzzyText/gradientColors';
import useCourseStore from '../zustand/courseStore';
import Button from '../components/button/button';
import { useLocation } from 'react-router-dom';

export default function Beranda2() {
  const location = useLocation();

  return (
    <Template
      activeNav="beranda"
      className="h-screen w-screen bg-gradient-to-t from-primary-300 from-0% via-primary-100 via-50% to-white-100 to-100%"
      locationKey={location.key}
    >
      <div className="xl:px-20 lg:px-10 md:px-14 sm:px-8 px-8 pt-8 w-full">
        <div className="mt-16 gap-8 w-full flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-1/2">
            <h3 className="p-2 px-4 rounded-full bg-primary-400 text-primary-900 font-medium items-center max-w-fit text-lg lg:text-xl">
              Welcome to Course Tanamin
            </h3>
            <h1 className="text-3xl lg:text-4xl font-semibold mt-16 lg:mt-32">
              Platform{' '}
              <GradientText
                className="bg-gradient-to-r from-primary-700 via-secondary-500 to-secondary-800"
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
      <div className="mt-16 lg:mt-32 w-screen bg-white-100">
        <div className="xl:p-20 lg:p-10 md:p-8 sm:p-6 p-4">
          <h2 className="text-2xl lg:text-4xl font-semibold">Kategori Populer</h2>
        </div>
      </div>
    </Template>
  );
}
