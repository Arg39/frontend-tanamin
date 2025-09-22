import React from 'react';
import AdminTemplate from '../../../../../template/templateAdmin';
import RingkasanEdit from '../../../../instructor/course.jsx/tabs/ringkasan/ringkasanEdit';
import { useLocation, useParams } from 'react-router-dom';

export default function RingkasanEditAdmin() {
  const location = useLocation();
  const { id } = useParams();
  const breadcrumbItems = [
    { label: 'Ringkasan', path: `/admin/kursus/${id}/lihat/ringkasan` },
    { label: 'Edit Ringkasan', path: location.pathname },
  ];
  return (
    <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <RingkasanEdit />
    </AdminTemplate>
  );
}
