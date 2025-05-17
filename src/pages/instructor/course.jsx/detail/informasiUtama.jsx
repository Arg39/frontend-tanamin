import React from 'react';

export default function CourseInformasiUtama({ editable }) {
  const imageUrl =
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <p className="text-2xl font-bold text-primary-900">Informasi Utama</p>
        {editable && (
          <button className="bg-secondary-500 text-black-900 px-6 py-1 md:py-2 rounded-lg shadow hover:bg-secondary-600 transition font-medium text-base">
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Left Column */}
        <div className="flex flex-col gap-4 col-span-1">
          <div className="flex items-start gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Nama Kursus</p>
              <p className="text-md text-gray-700">
                Bersama instruktur <span className="font-bold">Beatrice Jasmine</span>, Anda akan
                mempelajari UI Design plus UI Illustration
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Nama Instruktur</p>
              <p className="text-md text-gray-700">Beatrice Jasmine</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Level</p>
              <p className="text-md text-gray-700">Menengah</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">💸</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Harga</p>
              <p className="text-md text-gray-700">Rp. 100.000</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Sertifikat</p>
              <p className="text-md text-gray-700">Dibuatkan</p>
            </div>
          </div>
        </div>
        {/* Divider for mobile */}
        <div className="block md:hidden border-t border-gray-200 my-4 col-span-full" />
        {/* Right Column */}
        <div className="flex flex-col col-span-1">
          <p className="font-semibold text-lg text-primary-800 mb-2">Gambar</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center">
            <img
              src={imageUrl}
              alt="Course"
              className="w-full max-w-80 max-h-80 object-cover rounded-lg shadow border"
            />
          </div>
        </div>
      </div>
      {/* desc col full */}
      <div className="flex flex-col">
        <p className="font-semibold text-lg text-primary-800 mb-2">Detail yang akan dipelajari</p>
        <p className="text-md text-gray-700 leading-relaxed">
          Bersama instruktur <span className="font-bold">Beatrice Jasmine</span>, Anda akan
          mempelajari UI Design plus UI Illustration dengan hasil akhir project design sebuah
          website.
          <br />
          Dengan mempelajari cara memahami brief client berdasarkan request yang diberikan, dan
          mempelajari cara berkolaborasi dengan designer lainnya, Anda akan memahami design process
          lebih baik lagi.
        </p>
      </div>
    </>
  );
}
