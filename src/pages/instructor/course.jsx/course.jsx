import React from 'react';
import InstructorTemplate from '../../../template/templateInstructor';

export default function CourseAdmin() {
  return (
    <InstructorTemplate activeNav="dashboard">
      <div className="w-full bg-white-100 rounded-md flex flex-col p-4 shadow-md">
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Kursus Saya</p>
          <div className="w-full flex flex-col sm:flex-row md:w-auto md:justify-end gap-4">
            <div className="flex flex-col justify-center items-start gap-1 bg-green-50 rounded-md px-4 py-2 shadow-sm w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-green-700">94</p>
              <p className="text-sm md:text-base text-green-700">Done</p>
            </div>
            <div className="flex flex-col justify-center items-start gap-1 bg-yellow-50 rounded-md px-4 py-2 shadow-sm w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-yellow-700">94</p>
              <p className="text-sm md:text-base text-yellow-700">In Progress</p>
            </div>
          </div>
        </div>
      </div>
    </InstructorTemplate>
  );
}
