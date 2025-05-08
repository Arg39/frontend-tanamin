import React from 'react';
import AdminTemplate from '../../../template/templateAdmin';

export default function Course() {
  return (
    <AdminTemplate activeNav="kursus">
      <div className="bg-white-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Daftar Kursus</h2>
      </div>
    </AdminTemplate>
  );
}
