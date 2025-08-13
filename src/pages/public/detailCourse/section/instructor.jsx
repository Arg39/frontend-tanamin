import React, { useEffect } from 'react';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/public/course/courseStore';

export default function InstructorCourseDetail({
  course,
  bioExpanded,
  setBioExpanded,
  sectionRef,
}) {
  const { instructor, instructorLoading, instructorError, fetchInstructorByCourseId } =
    useCourseStore();

  useEffect(() => {
    if (course?.id) {
      fetchInstructorByCourseId(course.id);
    }
  }, [course?.id, fetchInstructorByCourseId]);

  if (instructorLoading) {
    return (
      <div
        ref={sectionRef}
        className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28"
        id="instructor"
      >
        <p className="text-center text-gray-500">Loading instruktur...</p>
      </div>
    );
  }

  if (instructorError) {
    return (
      <div
        ref={sectionRef}
        className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28"
        id="instructor"
      >
        <p className="text-center text-red-500">{instructorError}</p>
      </div>
    );
  }

  if (!instructor) return null;

  return (
    <div
      ref={sectionRef}
      className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28"
      id="instructor"
    >
      <div className="w-full flex flex-col gap-4">
        <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
          Instruktur
        </p>
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src={
              instructor.photo_profile ||
              'https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt={`${instructor.first_name || ''} ${instructor.last_name || ''}`}
            className="w-32 h-32 sm:w-56 sm:h-56 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left w-full relative">
            <button className="text-xl sm:text-xl font-bold text-primary-800">
              {instructor.first_name} {instructor.last_name}
            </button>
            <p
              className={`text-lg text-primary-700 ${
                !instructor.detail?.expertise ? 'hidden' : ''
              }`}
            >
              {instructor.detail?.expertise}
            </p>
            <div className="flex flex-row gap-4 sm:gap-8 items-center sm:items-start">
              <p className="flex items-center text-md text-black">
                <Icon type={'star'} className="w-6 h-6 text-tertiary-600 inline-block mr-2" />
                {instructor.total_review || 0} Ulasan
              </p>
              <p className="flex items-center text-md text-black">
                {instructor.average_rating || 0} rating
              </p>
              <p className="flex items-center text-md text-black">
                <Icon type={'users'} className="w-6 h-6 inline-block mr-2" />
                {instructor.total_student || 0} Siswa
              </p>
            </div>
            <p className="flex items-center text-md text-black">
              <Icon type={'book'} className="w-6 h-6 inline-block mr-2" />
              {instructor.total_courses || 0} Kursus
            </p>
            {/* Mobile collapse/expand */}
            <div className="block sm:hidden w-full relative">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  !bioExpanded ? 'max-h-16' : 'max-h-96'
                }`}
                style={{ position: 'relative' }}
              >
                <p className={`line-clamp-none`}>{instructor.bio || 'Bio tidak tersedia.'}</p>
                {!bioExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
              </div>
              <button
                className="text-primary-700 text-sm font-semibold mt-1"
                onClick={() => setBioExpanded((v) => !v)}
                type="button"
              >
                {bioExpanded ? 'Tutup' : 'Lihat Selengkapnya'}
              </button>
            </div>
            {/* Desktop: show all bio */}
            <p className="w-full line-clamp-1">
              {instructor.detail?.about || 'Bio tidak tersedia.'}
            </p>
            <div className="flex flex-row gap-2 justify-center sm:justify-start w-full">
              {Array.isArray(instructor.detail?.social_media) &&
              instructor.detail.social_media.length > 0
                ? instructor.detail.social_media.map((media, idx) => (
                    <a
                      key={idx}
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors"
                    >
                      <Icon type={media.type} className="w-6 h-6" />
                    </a>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
