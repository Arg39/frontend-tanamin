import React from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import CuourseDetail from '../../instructor/course.jsx/detail/courseDetail';

export default function CuourseDetailAdmin() {
  return (
    <AdminTemplate activeNav="kursus">
      <CuourseDetail editable={false} />
    </AdminTemplate>
  );
}
