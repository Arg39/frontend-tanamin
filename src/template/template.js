import React from 'react';
import Navbar from '../components/navbar/navbar';

export default function Template({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="pt-16 lg:pt-20 px-4 lg:px-8 flex-1 z-0 relative">{children}</div>
    </div>
  );
}
