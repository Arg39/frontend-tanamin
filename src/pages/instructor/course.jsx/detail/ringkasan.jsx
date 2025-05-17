import React from 'react';

export default function CourseInformasiUtama({ editable }) {
  const imageUrl =
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Informasi Utama</p>
        {editable && (
          <button className="bg-secondary-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>
      {/* neeed using existing data */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col">
          <p className="font-medium text-xl">Nama kursus</p>
          <p className="mt-2 text-md">
            Bersama instruktur Beatrice Jasmine, Anda akan mempelajari UI Design plus UI
            Illustration
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-xl">Gambar</p>
          <img src={imageUrl} alt="" />
          <img src={imageUrl} alt="" />
          <img src={imageUrl} alt="" />
        </div>
      </div>
      {/* nama, kategori, gambar/video, harga */}
    </>
  );
}
