import React from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import RingkasanEdit from './tabs/ringkasan/ringkasanEdit';

export default function RingkasanEditInstructor() {
  return (
    <InstructorTemplate activeNav="kursus">
      <RingkasanEdit />
    </InstructorTemplate>
  );
}
