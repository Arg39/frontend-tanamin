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
      <p className="mt-4 text-md">
        Bersama instruktur Beatrice Jasmine, Anda akan mempelajari UI Design plus UI Illustration
        dengan hasil akhir project design sebuah website. Dengan mempelajari cara memahami brief
        client berdasarkan request yang diberikan, dan mempelajari cara berkolaborasi dengan
        designer lainnya, Anda akan memahami design process lebih baik lagi.
      </p>
      {/* table yang akan digunakan untuk crud Deskripsi */}
    </>
  );
}
