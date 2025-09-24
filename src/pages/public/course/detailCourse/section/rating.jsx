import React, { useEffect } from 'react';
import { RatingSummary } from '../../../../../components/content/star/ratingSumarry';
import useCourseStore from '../../../../../zustand/public/course/courseStore';

export default function RatingCourseDetail({ course, sectionRef }) {
  const courseId = course?.id;
  const { courseRatings, courseRatingsLoading, fetchRatingsByCourseId } = useCourseStore();

  useEffect(() => {
    if (courseId) {
      fetchRatingsByCourseId(courseId);
    }
  }, [courseId, fetchRatingsByCourseId]);

  // Prepare summary for RatingSummary component
  const summary = React.useMemo(() => {
    if (!courseRatings || !courseRatings.detail_rating) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
    // Convert array to object { 5: total, ... }
    return courseRatings.detail_rating.reduce(
      (acc, item) => {
        acc[item.rating] = item.total;
        return acc;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );
  }, [courseRatings]);

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
            <p className="text-xl text-white font-semibold">
              {courseRatingsLoading ? '-' : (courseRatings?.rating ?? 0).toFixed(1)}
            </p>
            <p className="text-xs text-white font-semibold whitespace-nowrap">Course Rating</p>
          </div>
          <div className="w-full">
            <RatingSummary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
