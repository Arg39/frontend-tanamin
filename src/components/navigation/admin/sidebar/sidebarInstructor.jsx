import React from 'react';
import Sidebar from './sidebar';

export default function SidebarInstructor() {
  const instructorMenu = ['Dashboard', 'My Courses', 'Assignments', 'Profile'];

  return <Sidebar title="Instructor Panel" menuItems={instructorMenu} />;
}
