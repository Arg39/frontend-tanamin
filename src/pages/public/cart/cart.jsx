import React from 'react';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';

export default function CourseCart() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Keranjang', path: location.pathname },
  ];

  return (
    <Template activeNav="keranjang" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
          Keranjang
        </h1>
      </main>
    </Template>
  );
}
