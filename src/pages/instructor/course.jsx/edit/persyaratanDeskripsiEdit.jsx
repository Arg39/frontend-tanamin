import React from 'react';
import InstructorTemplate from '../../../../template/templateInstructor';
import Icon from '../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';

export default function PersyaratanDeskripsiEdit() {
  const navigate = useNavigate();
  const { id, id2 } = useParams();

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="flex w-fit items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-[1rem] text-white-100" />
          Kembali
        </button>
        <div className="text-2xl font-bold">Edit Persyaratan/Deskripsi {id2}</div>
        {/* content add */}
      </div>
    </InstructorTemplate>
  );
}
