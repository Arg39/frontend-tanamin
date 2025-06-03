import React from 'react';
import Icon from '../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';

export default function CoursePersyaratan({ editable }) {
  const { id, tab } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-2xl font-bold text-primary-800">Persyaratan dan Deskripsi</p>
          {editable && (
            <button
              onClick={() => navigate(`/instruktur/kursus/${id}/tambah/persyaratan`)}
              className="bg-primary-700 text-white-100 px-6 py-1 md:py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center"
            >
              <Icon type="plus" className="mr-2" />
              Tambah
            </button>
          )}
        </div>
      </div>

      {/* persyaratan */}
      <div className="p-2">
        <p className="text-lg text-tertiary-600 font-bold">Persyaratan:</p>
        <div className="flex justify-between items-center bg-white-100 px-4 py-1 rounded-lg border border-primary-700 mb-4">
          <div className="flex items-center gap-2">
            <p>1.</p>
            <p>Memiliki perangkat komputer atau laptop dengan koneksi internet stabil</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <button className="bg-primary-700 text-white-100 px-4 py-1 rounded hover:bg-primary-800">
                Edit
              </button>
              <button className="bg-red-700 text-white-100 px-4 py-1 rounded hover:bg-red-800">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* deskripsi */}
      <div className="p-2">
        <p className="text-lg text-tertiary-600 font-bold">Deskripsi:</p>
        <div className="flex justify-between items-center bg-white-100 px-4 py-1 rounded-lg border border-primary-700 mb-4">
          <div className="flex gap-2">
            <p>1.</p>
            <p className="w-[95%]">
              Memiliki perangkat komputer atau laptop dengan koneksi internet stabil Memiliki
              perangkat komputer atau laptop dengan koneksi internet stabil Memiliki perangkat
              komputer atau laptop dengan koneksi internet stabil
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-primary-700 text-white-100 px-4 py-1 rounded hover:bg-primary-800">
              Edit
            </button>
            <button className="bg-red-700 text-white-100 px-4 py-1 rounded hover:bg-red-800">
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* Table yang akan digunakan untuk CRUD persyaratan */}
    </>
  );
}
