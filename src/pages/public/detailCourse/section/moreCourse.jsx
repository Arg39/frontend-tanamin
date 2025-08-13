import React, { useEffect } from 'react';
import Icon from '../../../../components/icons/icon';
import Card from '../../../../components/card/card';
import useCourseStore from '../../../../zustand/public/course/courseStore';

export default function MoreCourse({ course }) {
  const {
    othersCourseInstructor,
    othersCourseInstructorLoading,
    othersCourseInstructorError,
    fetchOthersCourseInstructor,
  } = useCourseStore();

  useEffect(() => {
    if (course?.id) {
      fetchOthersCourseInstructor(course.id);
    }
    // eslint-disable-next-line
  }, [course?.id]);

  return (
    <div className="w-full px-0 z-10">
      <div className="w-full xl:px-24 lg:px-16 md:px-10 sm:px-6 px-2 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-1 border-b-2 border-primary-700">
          <p className="text-xl sm:text-2xl font-bold text-primary-700 sm:mb-0">
            Lainnya dari {course?.instructor?.name || '-'} {course?.instructor?.last_name || ''}
          </p>
          <button className="flex items-center gap-2 font-normal text-white p-1 px-4 bg-primary-700 rounded-lg hover:bg-primary-800 transition-colors mt-2 sm:mt-0">
            Lihat lainnya...
            <Icon type="arrow-right" className="w-4 h-4" color="currentColor" />
          </button>
        </div>
        <div className="w-full h-fit overflow-y-auto">
          {othersCourseInstructorLoading && (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          )}
          {othersCourseInstructorError && (
            <p className="text-center text-red-500 py-8">{othersCourseInstructorError}</p>
          )}
          {!othersCourseInstructorLoading && !othersCourseInstructorError && (
            <Card course={othersCourseInstructor} maxWidth={20} flexRow />
          )}
        </div>
      </div>
    </div>
  );
}
