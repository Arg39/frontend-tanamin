import React, { useEffect, useRef } from 'react';
import Template from '../template/template';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import Icon from '../components/icons/icon';
import useCourseStore from '../zustand/public/course/courseStore';

function formatRupiah(price) {
  if (typeof price !== 'number') {
    price = Number(price);
  }
  if (isNaN(price)) return '';
  return 'Rp. ' + price.toLocaleString('id-ID');
}

function CourseCard({ course }) {
  if (!course) return null;

  return (
    <div className="bg-white border-4 border-primary-700 shadow-lg rounded-xl p-4 sm:p-6 w-full">
      <img className="w-full rounded-xl" src={course.image} alt={course.title} />
      <div className="w-full py-4 flex items-center justify-center">
        <p className="text-xl sm:text-2xl font-medium text-tertiary-500">
          {formatRupiah(course.price)}
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <button className="w-full py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
          Tambahkan Ke Keranjang
        </button>
        <button className="w-full py-2 border-2 border-primary-700 bg-white text-primary-700 rounded-lg hover:bg-primary-800 hover:text-white text-base transition-colors">
          Beli Sekarang
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary-700 font-semibold">Detail</p>
        <div className="flex flex-col gap-2 mt-2">
          {[
            ['Peserta', '243'],
            ['Level', 'Pemula'],
            ['Total Materi', '7'],
            ['Evaluasi', '3'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center border-b-2 border-secondary-500 pb-1 mb-2"
            >
              <p className="text-secondary-700 font-medium">{label}</p>
              <p className="p-1 px-2 bg-secondary-500 text-white rounded-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-primary-700 font-semibold">Kupon Kursus</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="border-2 border-primary-700 text-primary-700 rounded-lg p-2 flex-1"
            placeholder="Masukkan kupon"
          />
          <button className="bg-primary-700 text-white rounded-lg px-4 py-2">Masukkan</button>
        </div>
      </div>
    </div>
  );
}

export default function PublicCourse() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Detail Kursus', path: location.pathname },
  ];
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { course, fetchCourseById, loading, error } = useCourseStore();
  const stickyParentRef = useRef(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);

  return (
    <Template activeNav="beranda" className="h-auto w-full bg-white" locationKey={location.key}>
      <div className="relative w-full">
        {/* === Sticky card (desktop) === */}
        <div
          ref={stickyParentRef}
          className="hidden lg:flex absolute top-8 xl:right-24 lg:right-16 md:right-10 h-full items-start pointer-events-none z-30"
          style={{ width: '25%', minWidth: 320, maxWidth: 400 }}
        >
          <div className="sticky top-24 w-full pointer-events-auto">
            <CourseCard course={course} />
          </div>
        </div>

        {/* === Layer 1: Gradient Area === */}
        <div className="w-full bg-gradient-to-t from-primary-100 via-primary-100 to-white z-10">
          <div className="mx-auto flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/4 xl:pl-24 lg:pl-16 md:pl-10 sm:pl-6 px-4 pt-8 pb-16">
              <Breadcrumb items={breadcrumbItems} />
              <div className="pt-8">
                <button
                  className="flex items-center gap-2 bg-primary-700 text-white text-lg font-semibold px-6 py-2 rounded-full mb-4 hover:bg-primary-800"
                  onClick={() => navigate(-1)}
                >
                  <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
                  <span>Kembali</span>
                </button>
                {course && (
                  <>
                    <p className="text-3xl md:text-4xl font-medium">{course.title}</p>
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-secondary-700 font-medium">Level</p>
                      <p className="p-1 px-2 bg-secondary-500 text-white rounded-lg w-max">
                        Pemula
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block w-1/4" />
          </div>
        </div>

        {/* === Layer 2: Area Putih === */}
        <div className="w-full bg-white z-0">
          <div className="mx-auto flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/4 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 py-16">
              <p className="mb-32">content diarea putih</p>
              {/* Sticky card versi mobile tampil di sini */}
              <div className="block lg:hidden mt-8">
                <CourseCard course={course} />
              </div>
            </div>
            <div className="hidden lg:block w-1/4" />
          </div>
        </div>

        {/* Loading dan Error */}
        {loading && <p className="text-center text-gray-500 py-8">Loading...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
      </div>
    </Template>
  );
}
