import React from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import RingkasanEdit from '../../../instructor/course.jsx/tabs/ringkasan/ringkasanEdit';

export default function RingkasanEditAdmin() {
  return (
    <AdminTemplate activeNav="kursus">
      <RingkasanEdit />
    </AdminTemplate>
  );
}
