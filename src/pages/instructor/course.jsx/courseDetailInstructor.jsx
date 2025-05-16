import React from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import CuourseDetail from './detail/courseDetail';

export default function CuourseDetailInstructor() {
  return (
    <InstructorTemplate activeNav="kursus">
      <CuourseDetail editable={true} />
    </InstructorTemplate>
  );
}
