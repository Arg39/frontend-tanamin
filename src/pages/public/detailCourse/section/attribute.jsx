import React from 'react';
import Icon from '../../../../components/icons/icon';

export default function AttributeCourseDetail() {
  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="attribute">
      {/* Ubah flex-row jadi flex-col di mobile */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        <div className="w-full flex flex-col gap-4">
          <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
            Persyaratan
          </p>
          <div className="flex flex-row gap-2 mb-4">
            <Icon type={'check'} />
            <p>persyaratan 1</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 md:mb-6 scroll-mt-28">
          <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
            Deskripsi
          </p>
          <div className="flex flex-row gap-2 mb-4">
            <Icon type={'check'} />
            <p>deskripsi 1</p>
          </div>
          <div className="flex flex-row gap-2 mb-4">
            <Icon type={'check'} />
            <p>deskripsi 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
