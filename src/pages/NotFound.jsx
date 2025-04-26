import React from 'react';
import FuzzyText from '../blocks/TextAnimations/FuzzyText/FuzzyText';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white text-center font-bold px-4">
      <FuzzyText
        baseIntensity={0.3}
        hoverIntensity={true}
        enableHover={true}
        fontSize="clamp(8rem, 3vw, 4rem)"
      >
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.3}
        hoverIntensity={true}
        enableHover={true}
        fontWeight={600}
        fontSize="clamp(4rem, 4vw, 4rem)"
      >
        Not Found
      </FuzzyText>
    </div>
  );
}
