import React from 'react';

export default function CoursePersyaratan({ editable }) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <p className="text-2xl font-bold text-primary-900">Persyaratan</p>
        {editable && (
          <button className="bg-secondary-500 text-black-900 px-6 py-1 md:py-2 rounded-lg shadow hover:bg-secondary-600 transition font-medium text-base">
            Edit
          </button>
        )}
      </div>
      {/* table yang akan digunakan untuk crud persyaratan */}
    </>
  );
}
