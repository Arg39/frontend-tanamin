import React from 'react';

export default function CourseDeskripsi({ editable }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">Deskripsi</p>
        {editable && (
          <button className="bg-secondary-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>
      {/* table yang akan digunakan untuk crud Deskripsi */}
    </>
  );
}
