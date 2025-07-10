import React from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import CuourseDetail from '../../instructor/course.jsx/detail/courseDetail';
import { useLocation } from 'react-router-dom';

export default function CuourseDetailAdmin() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kursus', path: '/admin/kursus' },
    { label: 'Detail Kursus', path: location.pathname },
  ];

  return (
    <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <CuourseDetail editable={false} />
    </AdminTemplate>
  );
}
