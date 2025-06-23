import React from 'react';
import FuzzyText from '../blocks/TextAnimations/FuzzyText/FuzzyText';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-black-900 text-white-100 text-center font-bold px-4">
      <FuzzyText
        baseIntensity={0.3}
        hoverIntensity={0.5}
        enableHover={true}
        fontSize="clamp(8rem, 3vw, 4rem)"
        fontWeight={900}
      >
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.3}
        hoverIntensity={0.5}
        enableHover={true}
        fontWeight={600}
        fontSize="clamp(4rem, 4vw, 4rem)"
      >
        Not Found
      </FuzzyText>
    </div>
  );
}
