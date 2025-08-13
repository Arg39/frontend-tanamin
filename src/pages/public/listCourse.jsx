import React from 'react';
import Template from '../../template/template';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import Checkbox from '../../components/form/checkbox';
import FilterCard from '../../components/filter/filterCard';

export default function ListCourse() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kontak Kami', path: location.pathname },
  ];

  return (
    <Template activeNav="faq" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary-700 mb-4">
            Explore Tanamin Courses
          </h1>
          <h5 className="text-xl font-light text-primary-800">
            Kembangkan Keahlian Anda Melalui Kursus yang dirancang oleh para ahli dalam industri
          </h5>
          <div className="w-full mt-16 flex flex-row gap-8">
            <div className="w-1/5">
              <FilterCard />
            </div>
            <div className="w-4/5">
              <input type="text" className="w-full p-2 border border-primary-700" />
              <div></div>
            </div>
          </div>
        </div>
      </main>
    </Template>
  );
}
