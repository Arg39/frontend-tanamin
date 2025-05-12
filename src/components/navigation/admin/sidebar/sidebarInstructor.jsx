import React from 'react';
import Sidebar from './sidebar';
import useNavigationStore from '../../../../zustand/navigationStore';

export default function SidebarInstructor({ activeNav, isOpen, onClose }) {
  const navigationinstructor = useNavigationStore((state) => state.navigationInstructor);

  return (
    <Sidebar
      title="Instructor Panel"
      navigations={navigationinstructor}
      activeNav={activeNav}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
