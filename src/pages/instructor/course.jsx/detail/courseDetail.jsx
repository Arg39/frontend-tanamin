import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../../components/icons/icon';
import CourseRingkasan from './ringkasan';
import CoursePersyaratan from './persyaratan';
import CourseDeskripsi from './deskripsi';
import CourseMateri from './materi';
import useNavigationStore from '../../../../zustand/navigationStore';

const tabComponents = {
  ringkasan: CourseRingkasan,
  persyaratan: CoursePersyaratan,
  deskripsi: CourseDeskripsi,
  materi: CourseMateri,
};

export default function CuourseDetail() {
  const navigate = useNavigate();
  const { id, tab } = useParams();
  const activeTab = tab || 'ringkasan';

  const tabs = useNavigationStore((state) => state.courseDetailTabs);

  const handleTabChange = (tabName) => {
    navigate(`/instruktur/kursus/lihat/${id}/${tabName}`);
  };

  const ActiveComponent = tabComponents[activeTab] || CourseRingkasan;

  return (
    <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4 ">
      <div>
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate('/instruktur/kursus')}
        >
          <Icon type="arrow-left" className="size-[1rem] text-white-100" />
          <span className="text-white-100">Kembali</span>
        </button>
        <h4 className="text-lg sm:text-2xl font-bold">Detail Kursus</h4>
      </div>
      <div className="flex flex-nowrap overflow-x-auto gap-2 p-2 sm:pb-0">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            className={`flex-shrink-0 p-2 px-4 rounded-full border transition-colors duration-150 text-sm sm:text-base ${
              activeTab === tabItem.key
                ? 'bg-primary-800 text-white-100'
                : 'border-primary-800 text-primary-800'
            }`}
            onClick={() => handleTabChange(tabItem.key)}
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 p-2 sm:p-4 rounded-md bg-white-100 ">
        <ActiveComponent />
      </div>
    </div>
  );
}
