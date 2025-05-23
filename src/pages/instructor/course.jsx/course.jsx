import React, { useEffect, useState } from 'react';
import InstructorTemplate from '../../../template/templateInstructor';
import ReactTable from '../../../components/table/reactTable';
import TableFilter from '../../../components/table/tableFilter';
import useCourseStore from '../../../zustand/courseStore';
import { Link } from 'react-router-dom';

export default function CourseAdmin() {
  const {
    instructorCourses,
    instructorPagination,
    fetchInstructorCourses,
    sortBy,
    sortOrder,
    loading,
  } = useCourseStore();

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
      sortBy,
      sortOrder,
      page: instructorPagination.currentPage,
      perPage: instructorPagination.perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  }, [
    sortBy,
    sortOrder,
    instructorPagination.currentPage,
    instructorPagination.perPage,
    filterValues,
  ]);

  const handleSortChange = (column, order) => {
    fetchInstructorCourses({
      sortBy: column,
      sortOrder: order,
      page: instructorPagination.currentPage,
      perPage: instructorPagination.perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageChange = (page) => {
    fetchInstructorCourses({
      sortBy,
      sortOrder,
      page,
      perPage: instructorPagination.perPage,
      search: filterValues.search,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageSizeChange = (perPage) => {
    fetchInstructorCourses({
      sortBy,
      sortOrder,
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

  const columns = [
    {
      Header: 'Judul Kursus',
      accessor: 'title',
      width: '40%',
    },
    {
      Header: 'Kategori',
      accessor: 'category',
      width: '25%',
      disableSort: true,
    },
    {
      Header: 'Tanggal Dibuat',
      accessor: 'created_at',
      width: '20%',
      Cell: ({ value }) =>
        new Date(value).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '15%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="w-fit flex flex-row md:flex-col gap-2 justify-center items-start text-md mt-2 md:mt-0">
          <Link
            to={`/instruktur/kursus/lihat/${value}/informasi-utama`}
            className="p-2 px-4 rounded-md bg-secondary-500 hover:bg-secondary-700"
          >
            Lihat Kursus
          </Link>
          <Link
            to={`/instruktur/kursus/peserta/${value}`}
            className="p-2 px-4 rounded-md bg-primary-500 hover:bg-primary-700"
          >
            Lihat Peserta
          </Link>
        </div>
      ),
    },
  ];

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 rounded-md flex flex-col p-6 shadow-md">
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <p className="text-xl md:text-3xl font-bold mb-2 md:mb-0">Kursus</p>
          {/* <div className="w-full flex sm:flex-row md:justify-end gap-4">
            <div className="flex flex-col justify-center items-start gap-1 bg-primary-300 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-primary-700">94</p>
              <p className="text-sm md:text-base text-primary-700">Done</p>
            </div>
            <div className="flex flex-col justify-center items-start gap-1 bg-yellow-50 rounded-md px-4 py-2 w-full sm:w-1/2 md:w-32">
              <p className="text-lg md:text-2xl font-bold text-yellow-700">94</p>
              <p className="text-sm md:text-base text-yellow-700">In Progress</p>
            </div>
          </div> */}
        </div>

        <TableFilter
          filters={filterConfigs}
          values={filterValues}
          onFilterChange={setFilterValues}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <ReactTable
            columns={columns}
            data={instructorCourses}
            numbering={true}
            onSortChange={handleSortChange}
            pagination={instructorPagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}
      </div>
    </InstructorTemplate>
  );
}
