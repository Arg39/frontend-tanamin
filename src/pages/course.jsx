import React, { useEffect, useRef, useState } from 'react';
import Template from '../template/template';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/breadcrumb';
import Icon from '../components/icons/icon';
import useCourseStore from '../zustand/public/course/courseStore';
import StarRating from '../components/content/star/star';
import WysiwygContent from '../components/content/wysiwyg/WysiwygContent';

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
    <div className="bg-white border-4 border-primary-700 shadow-lg rounded-xl p-4 sm:p-6 w-full mb-8">
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
            className="w-full border-2 border-primary-700 text-primary-700 rounded-lg p-2 flex-1"
            placeholder="Masukkan kupon"
          />
          <button className="w-full bg-primary-700 text-white rounded-lg px-4 py-2 sm:w-auto">
            Masukkan
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileStickyCard({ course }) {
  const [expanded, setExpanded] = React.useState(false);

  if (!course) return null;

  return (
    <>
      {/* Overlay expanded card */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end lg:hidden">
          <div className="w-full bg-white rounded-t-2xl shadow-lg max-h-[90vh] animate-slide-up flex flex-col">
            {/* Header tetap di atas */}
            <div className="flex-shrink-0 flex justify-between items-center px-4 pt-4 pb-2 border-b bg-white rounded-t-2xl z-10">
              <span className="text-lg font-semibold text-primary-700">Detail Kursus</span>
              <button
                className="text-gray-500 text-2xl font-bold px-2"
                onClick={() => setExpanded(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            {/* Konten scrollable */}
            <div className="overflow-y-auto flex-1 p-4">
              <img src={course.image} alt={course.title} className="w-full rounded-xl mb-4" />
              <div className="mb-2">
                <span className="text-xl font-semibold text-primary-700">{course.title}</span>
                <div className="text-base text-tertiary-500 font-medium mt-1">
                  {formatRupiah(course.price)}
                </div>
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
                    className="w-full border-2 border-primary-700 text-primary-700 rounded-lg p-2 flex-1"
                    placeholder="Masukkan kupon"
                  />
                  <button className="w-full bg-primary-700 text-white rounded-lg px-4 py-2 sm:w-auto">
                    Masukkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden bg-white border-t border-gray-200 shadow-[0_-2px_16px_0_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-primary-700 border border-primary-200 hover:bg-primary-50 transition"
              style={{ aspectRatio: 1 }}
              onClick={() => setExpanded(true)}
              aria-label="Lihat detail"
            >
              <Icon type="chevron-top" className="w-4 h-4" color="currentColor" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold text-primary-700 truncate">
                {course.title}
              </span>
              <span className="text-sm text-tertiary-500 font-medium">
                {formatRupiah(course.price)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[110px]">
            <button className="w-full py-1 px-3 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
              Keranjang
            </button>
            <button className="w-full py-1 px-3 border-2 border-primary-700 bg-white text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-800 hover:text-white transition-colors">
              Beli
            </button>
          </div>
        </div>
      </div>
      {/* Animasi slide-up */}
      <style>
        {`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.25s cubic-bezier(0.4,0,0.2,1);
          }
        `}
      </style>
    </>
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
      <div className="relative w-full pb-20 lg:pb-0">
        {/* === Sticky card (desktop) === */}
        <div
          ref={stickyParentRef}
          className="hidden lg:block w-1/4 xl:right-24 lg:right-16 md:right-10 absolute top-0 h-full items-start pointer-events-none z-30"
        >
          <div className="sticky top-16 pointer-events-auto hide-scrollbar overflow-y-auto max-h-[calc(100vh-36px)]">
            <CourseCard course={course} />
          </div>
        </div>

        {/* === Layer 1: Gradient Area === */}
        <div className="w-full bg-gradient-to-t from-primary-100 via-primary-100 to-white z-10">
          <div className="mx-auto flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/4 xl:pl-24 lg:pl-16 md:pl-10 sm:pl-6 px-2 sm:px-4 pr-0 lg:pr-28 pt-8 pb-8 sm:pb-16">
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
                    <p className="text-2xl sm:text-3xl md:text-4xl font-medium">{course.title}</p>
                    <div className="flex flex-col gap-2 mt-6 sm:mt-8">
                      <div className="flex flex-wrap items-end gap-4 sm:gap-8">
                        <p className="flex items-start gap-2 text-secondary-700 text-base sm:text-lg">
                          <Icon
                            type="user-2"
                            className="w-5 h-5 inline-block"
                            color="currentColor"
                          />
                          210 Siswa
                        </p>
                        <div className="flex items-end gap-2">
                          <p className="text-base sm:text-lg text-primary-700 font-medium">4.4</p>
                          <StarRating value={4} />
                        </div>
                        <p className="p-1 bg-white text-base sm:text-lg text-primary-700">
                          168 Rating
                        </p>
                      </div>
                      <div className="mt-4">
                        <button className="flex items-center gap-3">
                          <div className="border-2 border-primary-700 p-[4px] rounded-full">
                            <img
                              src={
                                'https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                              }
                              alt={`${course.instructor.first_name} ${course.instructor.last_name}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </div>
                          <p className="text-lg sm:text-xl text-primary-700 font-bold">
                            {course.instructor.first_name} {course.instructor.last_name}
                          </p>
                        </button>
                      </div>
                      <p className="flex items-center gap-2 text-base sm:text-lg font-medium mt-4 text-primary-700">
                        <Icon type={'date'} />
                        Terakhir diupdate pada 1 Juni 2024
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
            <div className="w-full lg:w-3/4 xl:pl-24 lg:pl-16 md:pl-10 sm:pl-6 px-2 sm:px-4 pr-0 lg:pr-28 pt-4 sm:pt-8 pb-8 sm:pb-16">
              {course && (
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-4 sm:mb-0">
                    <img className="w-full rounded-md" src={course.image} alt="" />
                  </div>
                  <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
                    <WysiwygContent html={course.detail || ''} maxHeight={350} />
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block w-1/4" />
          </div>
        </div>

        {/* Sticky mobile card di bawah */}
        {course && <MobileStickyCard course={course} />}

        {/* Loading dan Error */}
        {loading && <p className="text-center text-gray-500 py-8">Loading...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
      </div>
    </Template>
  );
}
