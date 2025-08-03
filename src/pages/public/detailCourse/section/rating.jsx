import React from 'react';
import { RatingSummary } from '../../../../components/content/star/ratingSumarry';

export default function RatingCourseDetail({ course, sectionRef }) {
  return (
    <div
      ref={sectionRef}
      className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28"
      id="rating"
    >
      <div className="w-full flex flex-col gap-4">
        <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
          Rating
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-fit flex flex-col justify-center items-center p-6 sm:p-12 bg-tertiary-600 rounded-md mb-2 sm:mb-4">
            <p className="text-xl text-white font-semibold">4.4</p>
            <p className="text-xs text-white font-semibold whitespace-nowrap">Course Rating</p>
          </div>
          <div className="w-full">
            <RatingSummary summary={course.ratingSummary || { 5: 12, 4: 3, 3: 2, 2: 1, 1: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
