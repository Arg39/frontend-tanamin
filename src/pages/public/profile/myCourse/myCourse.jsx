import React, { useEffect, useState } from 'react';
import ProfileSidebar from '../profileSidebar';
import useCourseStore from '../../../../zustand/public/course/courseStore';
import Card from '../../../../components/card/card';

export default function MyCourse() {
  const [activeTab, setActiveTab] = useState('enrolled');
  const { myCourses, myCoursesLoading, myCoursesError, fetchMyCourses } = useCourseStore();

  const tabOptions = [
    { key: 'enrolled', label: 'Enrolled' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    fetchMyCourses(activeTab);
  }, [activeTab, fetchMyCourses]);

  return (
    <ProfileSidebar activeNav={'kursus-saya'}>
      <div className="min-h-[660px] bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold border-b-2 pb-4 mb-6">My Course</h1>
        {/* Mobile: Dropdown */}
        <div className="md:hidden mb-4">
          <select
            className="w-full border border-gray-200 rounded px-4 py-2 text-base"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabOptions.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop: Tabs */}
        <div className="hidden md:flex flex-row border-b-2 border-gray-100">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              className={`w-full md:w-auto pb-2 md:pb-2 px-4 md:px-8 border-b-2 font-semibold text-base md:text-lg transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-primary-200'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {myCoursesLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : myCoursesError ? (
            <div className="text-center py-8 text-red-500">{myCoursesError}</div>
          ) : myCourses && myCourses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div key={course.id}>
                  <Card course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada kursus dengan status: {tabOptions.find((t) => t.key === activeTab)?.label}
            </div>
          )}
        </div>
      </div>
    </ProfileSidebar>
  );
}
