import React from 'react';
import Sidebar from './sidebar';
import useNavigationStore from '../../../../zustand/navigationStore';

export default function SidebarAdmin({ activeNav }) {
  const navigationAdmin = useNavigationStore((state) => state.navigationAdmin);

  return (
    <>
      <Sidebar title="Admin Panel" navigations={navigationAdmin} activeNav={activeNav} />
    </>
  );
}
