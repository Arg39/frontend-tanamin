import React, { useEffect, useRef } from 'react';
import Template from '../template/template';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import Icon from '../components/icons/icon';
import useCourseStore from '../zustand/public/course/courseStore';

export default function PublicCourse() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Detail Kursus', path: location.pathname },
  ];
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { course, fetchCourseById, loading, error } = useCourseStore();

  // Ref for sticky card parent
  const stickyParentRef = useRef(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);

  return (
    <Template activeNav="beranda" className="h-auto w-full bg-white" locationKey={location.key}>
      {/* === PAGE LAYER: Full width, relative for sticky card === */}
      <div className="relative w-full">
        {/* Sticky Card: absolute, right, full height of parent */}
        <div
          ref={stickyParentRef}
          className="absolute top-0 right-0 h-full flex items-start pointer-events-none z-30"
          style={{ width: '25%', minWidth: 320, maxWidth: 400 }}
        >
          <div className="sticky top-24 w-full pointer-events-auto">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Card Title</h3>
              <p>Card content goes here.</p>
            </div>
          </div>
        </div>

        {/* === LAYER 1: Gradient Area === */}
        <div className="w-full bg-gradient-to-t from-primary-300 via-primary-100 to-white z-10">
          <div className="max-w-screen-2xl mx-auto flex">
            {/* Main Content (3/4) */}
            <div className="w-full lg:w-3/4 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 pb-16">
              <Breadcrumb items={breadcrumbItems} />
              <div className="pt-8">
                <button
                  className="flex items-center gap-2 bg-primary-700 text-white text-lg font-semibold px-6 py-2 rounded-full mb-4 hover:bg-primary-800"
                  onClick={() => navigate(-1)}
                >
                  <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
                  <span>Kembali</span>
                </button>
                {course && <p>{course.title}</p>}
                <p className="mb-32">content</p>
                <p className="mb-32">content</p>
                <p className="mb-32">content</p>
                <p className="mb-32">content</p>
              </div>
            </div>
            {/* Spacer for sticky card */}
            <div className="hidden lg:block w-1/4" />
          </div>
        </div>

        {/* === LAYER 2: Area Putih === */}
        <div className="w-full bg-white z-0">
          <div className="max-w-screen-2xl mx-auto flex">
            {/* Main Content (3/4) */}
            <div className="w-full lg:w-3/4 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 py-16">
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
              <p className="mb-32">content diarea putih</p>
            </div>
            {/* Spacer for sticky card */}
            <div className="hidden lg:block w-1/4" />
          </div>
        </div>

        {/* Loading & Error */}
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </Template>
  );
}
