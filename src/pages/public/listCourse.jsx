import React, { useState, useEffect } from 'react';
import Template from '../../template/template';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import FilterCard from '../../components/filter/filterCard';

// Custom hook to detect screen width
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop;
}

export default function ListCourse() {
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kontak Kami', path: location.pathname },
  ];

  return (
    <Template activeNav="faq" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary-700 mb-4">
            Explore Tanamin Courses
          </h1>
          <h5 className="text-xl font-light text-primary-800">
            Kembangkan Keahlian Anda Melalui Kursus yang dirancang oleh para ahli dalam industri
          </h5>
          <div className="w-full mt-16 flex flex-row gap-2 lg:gap-8">
            {/* Filter Sidebar for Desktop */}
            {isDesktop && (
              <div className="w-1/5 min-w-[300px]">
                <FilterCard />
              </div>
            )}
            {/* Filter Button for Tablet/Mobile */}
            {!isDesktop && (
              <div className="w-1/5 min-w-[120px] flex flex-col">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-primary-700 text-white px-4 py-2 rounded-md w-full"
                >
                  Filter
                </button>
                {isFilterOpen && (
                  <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                      className="absolute inset-0 bg-black/50"
                      onClick={() => setIsFilterOpen(false)}
                    ></div>
                    {/* Side Panel */}
                    <div className="relative bg-white w-full max-w-xs h-full shadow-lg transform transition-transform duration-300 translate-x-0 mt-14">
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="absolute top-4 right-4 text-primary-700 bg-white rounded-full w-8 h-8 flex items-center justify-center p-0"
                      >
                        ✕
                      </button>
                      <FilterCard isMobile={true} />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="w-4/5 min-w-0">
              <input type="text" className="w-full p-2 border border-primary-700" />
              <div></div>
            </div>
          </div>
        </div>
      </main>
    </Template>
  );
}
