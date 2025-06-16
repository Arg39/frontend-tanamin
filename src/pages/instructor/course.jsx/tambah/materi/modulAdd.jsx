import React from 'react';
import InstructorTemplate from '../../../../../template/templateInstructor';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../../../components/icons/icon';

export default function ModulAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <div>
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon type="arrow-left" className="size-[1rem] text-white-100" />
            <span className="text-white-100">Kembali</span>
          </button>
          <h4 className="text-lg sm:text-2xl font-bold">Tambah modul kursus</h4>
        </div>
      </div>
    </InstructorTemplate>
  );
}
