import React, { useEffect } from 'react';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/public/course/courseStore';

export default function AttributeCourseDetail({ courseId }) {
  const { attribute, attributeLoading, attributeError, fetchAttributeByCourseId } =
    useCourseStore();

  useEffect(() => {
    if (courseId) {
      fetchAttributeByCourseId(courseId);
    }
    // eslint-disable-next-line
  }, [courseId]);

  if (attributeLoading) {
    return (
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="attribute">
        <p className="text-center text-gray-500">Memuat atribut...</p>
      </div>
    );
  }

  if (attributeError) {
    return (
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="attribute">
        <p className="text-center text-red-500">{attributeError}</p>
      </div>
    );
  }

  if (!attribute) return null;

  const { prerequisite, description } = attribute;

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="attribute">
      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        <div className="w-full flex flex-col gap-1 md:gap-4">
          <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
            Persyaratan
          </p>
          {prerequisite && prerequisite.length > 0 ? (
            prerequisite.map((req, idx) => (
              <div className="flex flex-row gap-2 items-start" key={idx}>
                <div className="flex items-center h-6 mt-1">
                  <Icon type={'check'} className="w-5 h-5 min-w-[20px] min-h-[20px]" />
                </div>
                <p className="flex items-center">{req}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada persyaratan.</p>
          )}
        </div>
        <div className="w-full flex flex-col gap-1 md:gap-4">
          <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
            Deskripsi
          </p>
          {description && description.length > 0 ? (
            description.map((desc, idx) => (
              <div className="flex flex-row gap-2 items-start" key={idx}>
                <div className="flex items-center h-6 mt-1">
                  <Icon type={'check'} className="w-5 h-5 min-w-[20px] min-h-[20px]" />
                </div>
                <p className="flex items-center">{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada deskripsi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
