import React from 'react';
import Template from '../template/template';
import GradientText from '../blocks/TextAnimations/FuzzyText/gradientColors';

export default function Beranda2() {
  return (
    <Template activeNav="beranda" className={''}>
      <p className="p-2 px-4 rounded-full bg-primary-800 items-center max-w-fit text-xl text-white-100">
        Welcome to Course Tanamin
      </p>
      <h1 className="text-5xl font-semibold mt-32">
        Platform{' '}
        <GradientText
          className="bg-gradient-to-r from-primary-700 via-secondary-500 to-accent-800"
          duration={6}
          fontSize="3rem"
        >
          Online Course
        </GradientText>{' '}
        Terbaik <br /> Untuk Mendorong Karir Anda
      </h1>
      <p className="text-4xl font-extralight mt-20">
        Jelajahi course terbaik dengan materi berkualitas <br />
        dan instruktur profesional
      </p>
    </Template>
  );
}
