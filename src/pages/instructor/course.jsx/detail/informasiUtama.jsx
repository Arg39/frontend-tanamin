import React from 'react';

function displayValue(value) {
  return value === null || value === undefined || value === ''
    ? 'belum diatur, silahkan edit untuk mengaturnya'
    : value;
}

export default function CourseInformasiUtama({ editable, data }) {
  // fallback if data is not loaded yet
  if (!data) {
    return <div>Data tidak ditemukan</div>;
  }

  const imageUrl = data.image_video
    ? data.image_video
    : 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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
              <p className="text-md text-gray-700">{displayValue(data.title)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Nama Instruktur</p>
              <p className="text-md text-gray-700">{displayValue(data.instructor?.full_name)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Level</p>
              <p className="text-md text-gray-700">{displayValue(data.level)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">💸</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Harga</p>
              <p className="text-md text-gray-700">
                {data.price === null || data.price === undefined
                  ? 'belum diatur, silahkan edit untuk mengaturnya'
                  : `Rp. ${data.price.toLocaleString('id-ID')}`}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-semibold text-lg text-primary-800 mb-2">Sertifikat</p>
              <p className="text-md text-gray-700">
                {/* Sertifikat info, fallback to belum diatur */}
                {displayValue(data.certificate)}
              </p>
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
        <p className="text-md text-gray-700 leading-relaxed">{displayValue(data.detail)}</p>
      </div>
    </>
  );
}
