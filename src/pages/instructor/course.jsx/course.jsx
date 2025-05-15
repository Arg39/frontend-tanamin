import React, { useEffect, useState } from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import Icon from '../../../components/icons/icon';
import ResponsiveList from '../../../components/table/responsiveList';
import TableFilter from '../../../components/table/tableFilter';
import useCourseStore from '../../../zustand/courseStore';
import { Link } from 'react-router-dom';

export default function CourseAdmin() {
  const { instructorCourses, instructorPagination, fetchInstructorCourses, loading } =
    useCourseStore();

  const [filterValues, setFilterValues] = useState({
    search: '',
    date: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setSearchInput(filterValues.search || '');
  }, [filterValues.search]);

  useEffect(() => {
    fetchInstructorCourses({
      page: instructorPagination.currentPage,
      perPage: instructorPagination.perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  }, [
    instructorPagination.currentPage,
    instructorPagination.perPage,
    filterValues.search,
    filterValues.date.start,
    filterValues.date.end,
  ]);

  const handlePageChange = (page) => {
    fetchInstructorCourses({
      page,
      perPage: instructorPagination.perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageSizeChange = (perPage) => {
    fetchInstructorCourses({
      page: 1,
      perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const filterConfigs = [
    {
      key: 'search',
      type: 'search',
      label: 'Cari Nama',
      placeholder: 'Cari kursus...',
      withButton: true,
    },
    {
      key: 'date',
      type: 'dateRange',
      label: 'Tanggal',
    },
  ];

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 rounded-md flex flex-col p-4 shadow-md">
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <p className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Kursus</p>
          <div className="w-full flex sm:flex-row md:justify-end gap-4">
            <div className="flex flex-col justify-center items-start gap-1 bg-primary-300 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-primary-700">94</p>
              <p className="text-sm md:text-base text-primary-700">Done</p>
            </div>
            <div className="flex flex-col justify-center items-start gap-1 bg-yellow-50 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-yellow-700">94</p>
              <p className="text-sm md:text-base text-yellow-700">In Progress</p>
            </div>
          </div>
        </div>

        <TableFilter
          filters={filterConfigs}
          values={filterValues}
          onFilterChange={setFilterValues}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />

        <ResponsiveList
          data={instructorCourses}
          pagination={instructorPagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          renderItem={(item) => (
            <Link
              to={`/instruktur/kursus/${item.id}`}
              className="w-full flex flex-row justify-between items-center p-2 px-6 gap-4 rounded-md bg-secondary-500"
            >
              <div>
                <p className="text-lg font-medium">{item.title}</p>
                <p className="font-normal">{item.category}</p>
                <p className="font-light">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="h-full flex justify-center items-center">
                <Icon type={'arrow-right'} className="size-6" color="black" />
              </div>
            </Link>
          )}
        />
      </div>
    </InstructorTemplate>
  );
}
