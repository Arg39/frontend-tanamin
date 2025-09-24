import React, { useState, useEffect, useRef } from 'react';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import FilterCard from '../../../components/filter/filterCard';
import Icon from '../../../components/icons/icon';
import useCourseStore from '../../../zustand/public/course/courseStore';
import Card from '../../../components/card/card';
import PaginationCard from '../../../components/filter/paginationCard';

// Tambahan: Import filter store
import { useFilterCourseStore } from '../../../zustand/public/course/filterCourseStore';

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
  const [searchValue, setSearchValue] = useState('');
  const searchBarRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: location.pathname },
  ];

  const { courses, coursesLoading, coursesError, fetchCourses, pagination } = useCourseStore();

  // Ambil filter state dari zustand filterCourseStore
  const getActiveFilters = useFilterCourseStore((state) => state.getActiveFilters);
  const checkedCategories = useFilterCourseStore((state) => state.checkedCategories);
  const checkedInstructor = useFilterCourseStore((state) => state.checkedInstructor);
  const checkedRatings = useFilterCourseStore((state) => state.checkedRatings);
  const checkedPrice = useFilterCourseStore((state) => state.checkedPrice);
  const checkedLevel = useFilterCourseStore((state) => state.checkedLevel);

  // Fetch courses when page, search, or filter changes
  useEffect(() => {
    const filters = getActiveFilters();
    fetchCourses({ page: currentPage, search: searchValue, filters });
  }, [
    fetchCourses,
    currentPage,
    searchValue,
    // depend on filter state
    checkedCategories,
    checkedInstructor,
    checkedRatings,
    checkedPrice,
    checkedLevel,
    getActiveFilters,
  ]);

  // Update pagination state from backend response
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.current_page || 1);
      setTotalPages(pagination.last_page || 1);
      setTotalCourses(pagination.total || 0);
    }
  }, [pagination]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    // fetchCourses dipanggil oleh useEffect di atas
  };

  // Get search bar height for filter modal
  const [searchBarHeight, setSearchBarHeight] = useState(0);
  useEffect(() => {
    if (searchBarRef.current) {
      setSearchBarHeight(searchBarRef.current.offsetHeight);
    }
  }, [searchBarRef.current, isFilterOpen]);

  return (
    <Template activeNav="kursus.kursus" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary-700 mb-4">
            Explore Tanamin Courses
          </h1>
          <h5 className="text-xl font-light text-primary-800">
            Kembangkan Keahlian Anda Melalui Kursus yang dirancang oleh para ahli dalam industri
          </h5>
          <div className="w-full mt-8 lg:mt-16 flex flex-row gap-2 lg:gap-8">
            {/* Filter Sidebar for Desktop */}
            {isDesktop && (
              <div className="w-1/5 min-w-[300px]">
                <FilterCard />
              </div>
            )}
            {/* Mobile/Tablet: Filter + Search in 2-column grid */}
            {!isDesktop && (
              <div className="w-full flex flex-col">
                <div className="flex flex-row gap-2 mb-4" ref={searchBarRef}>
                  {/* Filter Button */}
                  <div className="w-3/12">
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="w-full h-full bg-primary-700 text-white py-2 flex justify-center items-center rounded-md"
                      style={{ minHeight: '48px' }}
                    >
                      <Icon type="filter" className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="relative w-9/12">
                    <input
                      type="text"
                      className="w-full p-2 pr-10 border border-primary-700 placeholder:text-primary-800 placeholder:opacity-50 rounded-md focus:outline-none focus:ring-0"
                      placeholder="Cari Kursus Anda..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      style={{ minHeight: '48px' }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-700"
                      tabIndex={-1}
                    >
                      <Icon type="magnifying-glass" />
                    </button>
                  </form>
                </div>
                {/* Filter Modal */}
                {isFilterOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                      className="absolute inset-0 bg-black/50"
                      onClick={() => setIsFilterOpen(false)}
                    ></div>

                    {/* Filter Panel */}
                    <div className="relative w-full max-w-md mt-16 mx-auto p-0">
                      <div className="relative bg-white rounded-md shadow-lg h-full overflow-y-auto">
                        {/* Close Button */}
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="absolute top-2 right-2 text-primary-700 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          ✕
                        </button>

                        {/* FilterCard */}
                        <FilterCard isMobile={true} />
                      </div>
                    </div>
                  </div>
                )}
                {/* Course List Grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  {coursesLoading ? (
                    <div className="col-span-2 text-center py-8 text-primary-600">
                      Loading courses...
                    </div>
                  ) : coursesError ? (
                    <div className="col-span-2 text-center py-8 text-red-600">{coursesError}</div>
                  ) : courses && courses.length > 0 ? (
                    courses.map((course) => <Card key={course.id} course={course} />)
                  ) : (
                    <div className="col-span-2 text-center py-8 text-primary-600">
                      Tidak ada course tersedia.
                    </div>
                  )}
                </div>
                <div className="w-full mt-8">
                  <PaginationCard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            )}
            {/* Desktop: Search + Course List */}
            {isDesktop && (
              <div className="w-10/12 min-w-0">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    className="w-full p-2 pr-10 border border-primary-700 placeholder:text-primary-800 placeholder:opacity-50 rounded-md focus:outline-none focus:ring-0"
                    placeholder="Cari Kursus Anda..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-700"
                    tabIndex={-1}
                  >
                    <Icon type="magnifying-glass" />
                  </button>
                </form>
                {/* Course List Grid */}
                <div className="min-h-[800px]">
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {coursesLoading ? (
                      <div className="col-span-3 text-center py-8 text-primary-600">
                        Loading courses...
                      </div>
                    ) : coursesError ? (
                      <div className="col-span-3 text-center py-8 text-red-600">{coursesError}</div>
                    ) : courses && courses.length > 0 ? (
                      courses.map((course) => <Card key={course.id} course={course} />)
                    ) : (
                      <div className="col-span-3 text-center py-8 text-primary-600">
                        Tidak ada course tersedia.
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full mt-8">
                  <PaginationCard
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Template>
  );
}
