import React from 'react';
import InstructorTemplate from '../../../../template/templateInstructor';
import CuourseDetail from './courseDetail';
import { useLocation } from 'react-router-dom';

export default function CuourseDetailInstructor() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kursus', path: '/instruktur/kursus' },
    { label: 'Detail Kursus', path: location.pathname },
  ];

  return (
    <InstructorTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <CuourseDetail editable={true} />
    </InstructorTemplate>
  );
}
