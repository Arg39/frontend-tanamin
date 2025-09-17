import React from 'react';

export default function CertificateContentCourse({ data, loading, error, onNextLesson }) {
  if (loading) {
    return (
      <div className="min-h-[600px] p-8 flex items-center justify-center">
        <div>Loading sertifikat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] p-8 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[600px] p-8 flex items-center justify-center">
        <div>Belum ada sertifikat.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] p-8 border border-primary-700 rounded-lg mb-4 flex flex-col items-center justify-center">
      <div className="bg-white border-4 border-primary-700 rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-primary-700 mb-4">Sertifikat Penyelesaian</h2>
        <p className="text-lg mb-2">Diberikan kepada:</p>
        <p className="text-2xl font-bold mb-4">{data.user_name || 'Nama User'}</p>
        <p className="mb-2">Atas penyelesaian kursus:</p>
        <p className="text-xl font-semibold mb-4">{data.course_title || 'Nama Kursus'}</p>
        <p className="mb-2">Tanggal: {data.issued_at ? data.issued_at.split(' ')[0] : '-'}</p>
        <p className="mb-4">Kode Sertifikat: {data.certificate_code}</p>
        <button
          className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition"
          onClick={() => alert('Download sertifikat (dummy)')}
        >
          Download Sertifikat
        </button>
      </div>
    </div>
  );
}
