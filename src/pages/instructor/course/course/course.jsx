import React, { useEffect, useState } from 'react';
import InstructorTemplate from '../../../../template/templateInstructor';
import ReactTable from '../../../../components/table/reactTable';
import TableFilter from '../../../../components/table/tableFilter';
import useCourseStore from '../../../../zustand/courseStore';
import { Link, useLocation } from 'react-router-dom';

export default function CourseAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kursus', path: location.pathname }];

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
    useCourseStore.setState({ sortBy: column, sortOrder: order });
    fetchInstructorCourses({
      sortBy: column,
      sortOrder: order,
      page: 1,
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
      width: '15%',
      disableSort: true,
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => {
        let label = '';
        let colorClass = '';
        switch (value) {
          case 'new':
            label = 'Baru';
            colorClass = 'bg-gray-200 text-gray-800';
            break;
          case 'edited':
            label = 'Diedit';
            colorClass = 'bg-yellow-200 text-yellow-800';
            break;
          case 'awaiting_approval':
            label = 'Menunggu Persetujuan';
            colorClass = 'bg-blue-200 text-blue-800';
            break;
          case 'published':
            label = 'Dipublikasikan';
            colorClass = 'bg-green-200 text-green-800';
            break;
          default:
            label = 'Tidak Diketahui';
            colorClass = 'bg-gray-100 text-gray-500';
        }
        return <div className={`inline-block px-2 py-1 rounded ${colorClass}`}>{label}</div>;
      },
    },
    {
      Header: 'Tanggal',
      accessor: 'updated_at',
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
            to={`/instruktur/kursus/${value}/lihat/ringkasan`}
            className="p-2 px-4 rounded-md bg-primary-600 hover:bg-primary-700"
          >
            Lihat Kursus
          </Link>
        </div>
      ),
    },
  ];

  return (
    <InstructorTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-6 shadow-md">
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Kursus</h2>
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
