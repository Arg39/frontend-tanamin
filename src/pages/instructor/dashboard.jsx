import React, { useEffect } from 'react';
import InstructorTemplate from '../../template/templateInstructor';
import StatCard from '../../components/card/statCard';
import CourseTopicChart from '../../components/chart/courseTopicChart';
import dashboardStore from '../../zustand/temporaryDummyData/dashboardStore';

export default function DashboardInstructor() {
  const { data, loading, error, fetchDashboardInstructor } = dashboardStore();

  useEffect(() => {
    fetchDashboardInstructor(); // No date filter for instructor
    // eslint-disable-next-line
  }, []);

  const stats = [
    { key: 'total_courses', label: 'Total Course', icon: 'book' },
    { key: 'total_my_courses', label: 'My Course', icon: 'user-filled' },
    { key: 'total_categories', label: 'Category', icon: 'swatch' },
    { key: 'total_coupon', label: 'Coupon', icon: 'coupon' },
  ];

  return (
    <InstructorTemplate activeNav="dashboard">
      <div className="flex flex-col gap-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md h-32 animate-pulse" />
              ))
            : stats.map((stat) => (
                <StatCard
                  key={stat.key}
                  icon={stat.icon}
                  label={stat.label}
                  value={data ? data[stat.key] : 0}
                  className="h-full"
                />
              ))}
        </div>
        {/* Progress Course */}
        <div className="bg-white rounded-md p-4 shadow-md flex flex-col">
          <p className="text-xl font-semibold mb-2">Progress Course</p>
          {loading ? (
            <div className="h-40 animate-pulse bg-gray-100 rounded" />
          ) : (
            <CourseTopicChart progress={data?.progress || {}} />
          )}
        </div>
        {/* Error State */}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
      </div>
    </InstructorTemplate>
  );
}
