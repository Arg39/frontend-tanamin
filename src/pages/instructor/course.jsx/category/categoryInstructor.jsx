import React from 'react';
import CuourseDetail from '../../../admin/course/category/content/category.jsx';
import { useLocation } from 'react-router-dom';
import InstructorTemplate from '../../../../template/templateInstructor.js';

export default function CategoryInstructor() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kategori', path: location.pathname }];

  return (
    <InstructorTemplate activeNav="kategori" breadcrumbItems={breadcrumbItems}>
      <CuourseDetail editable={false} />
    </InstructorTemplate>
  );
}
