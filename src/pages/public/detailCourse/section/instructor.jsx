import React from 'react';
import Icon from '../../../../components/icons/icon';

export default function InstructorCourseDetail({
  course,
  bioExpanded,
  setBioExpanded,
  sectionRef,
}) {
  if (!course || !course.instructor) return null;

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
        {/* Responsive flex: column on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src={
              'https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt={`${course.instructor.first_name} ${course.instructor.last_name}`}
            className="w-32 h-32 sm:w-56 sm:h-56 rounded-full object-cover"
          />
          {/* Mobile: Collapse/expandable bio */}
          <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left w-full relative">
            <button className="text-xl sm:text-xl font-bold text-primary-800">
              {course.instructor.first_name} {course.instructor.last_name}
            </button>
            <p className="text-lg text-primary-700">ui ux designer</p>
            <div className="flex flex-row gap-4 sm:gap-8 items-center sm:items-start">
              <p className="flex items-center text-md text-black">
                <Icon type={'star'} className="w-6 h-6 text-tertiary-600 inline-block mr-2" />
                257 Ulasan
              </p>
              <p className="flex items-center text-md text-black">4.6 rating</p>
              <p className="flex items-center text-md text-black">
                <Icon type={'users'} className="w-6 h-6 inline-block mr-2" />
                415 Siswa
              </p>
            </div>
            <p className="flex items-center text-md text-black">
              <Icon type={'book'} className="w-6 h-6 inline-block mr-2" />7 Kursus
            </p>
            {/* Mobile collapse/expand */}
            <div className="block sm:hidden w-full relative">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  !bioExpanded ? 'max-h-16' : 'max-h-96'
                }`}
                style={{ position: 'relative' }}
              >
                <p className={`line-clamp-none`}>this is bio: An expert with 8 years experience</p>
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
            <p className="hidden sm:block line-clamp-1 sm:line-clamp-2">
              this is bio: An expert with 8 years experience
            </p>
            <div className="flex flex-row gap-2 justify-center sm:justify-start w-full">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
                <Icon type={'facebook'} className={'w-6 h-6'} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
                <Icon type={'instagram'} className={'w-6 h-6'} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
                <Icon type={'twitter-x'} className={'w-6 h-6'} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-primary-700 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
                <Icon type={'linkedin'} className={'w-6 h-6'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
