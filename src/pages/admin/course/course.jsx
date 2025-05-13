import React, { useEffect, useMemo, useState } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCourseStore from '../../../zustand/courseStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';
import useAuthStore from '../../../zustand/authStore';

export default function Course() {
  const {
    courses,
    fetchCourses,
    pagination,
    sortBy,
    sortOrder,
    perPage,
    error,
    loading,
    filters: storeFilters,
  } = useCourseStore();
  const { token } = useAuthStore();

  // Local filter state
  const [filters, setFilters] = useState({
    status: '',
    instructor: '',
    category: '',
    tanggal: '',
  });

  // Extract filter options from courses
  const filterOptions = useMemo(() => {
    const instructors = {};
    const categories = {};
    courses.forEach((c) => {
      if (c.instructor) instructors[c.instructor.id] = c.instructor.full_name;
      if (c.category) categories[c.category.id] = c.category.name;
    });
    return {
      status: [
        { value: '', label: 'Semua' },
        { value: '1', label: 'Published' },
        { value: '0', label: 'Draft' },
      ],
      instructor: [{ value: '', label: 'Semua' }].concat(
        Object.entries(instructors).map(([id, name]) => ({ value: id, label: name }))
      ),
      category: [{ value: '', label: 'Semua' }].concat(
        Object.entries(categories).map(([id, name]) => ({ value: id, label: name }))
      ),
    };
  }, [courses]);

  useEffect(() => {
    if (token) {
      fetchCourses({
        sortBy: 'title',
        sortOrder: 'asc',
        filters,
      });
    }
  }, [fetchCourses, token]);

  const handleSortChange = (column, order) => {
    fetchCourses({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      filters,
    });
  };

  const handlePageChange = (page) => {
    fetchCourses({ sortBy, sortOrder, perPage, page, filters });
  };

  const handlePageSizeChange = (size) => {
    fetchCourses({ sortBy, sortOrder, perPage: size, page: 1, filters });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchCourses({
      sortBy,
      sortOrder,
      perPage,
      page: 1,
      filters: newFilters,
    });
  };

  const columns = [
    {
      Header: 'Judul Kursus',
      accessor: 'title',
      width: '35%',
    },
    {
      Header: 'Kategori',
      accessor: (row) => row.category?.name || '-',
      id: 'category',
      width: '15%',
      disableSort: true,
    },
    {
      Header: 'Instruktur',
      accessor: (row) => row.instructor?.full_name || '-',
      id: 'instructor',
      width: '15%',
      disableSort: true,
    },
    {
      Header: 'Status',
      accessor: 'is_published',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded ${
            value ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    // tanggal
    {
      Header: 'Tanggal',
      accessor: 'updated_at',
      width: '15%',
      Cell: ({ value }) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(value));
      },
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="w-fit flex flex-row md:flex-col gap-2 justify-center items-start text-md mt-2 md:mt-0">
          <button
            className="p-1 px-4 rounded-md bg-primary-500 hover:bg-primary-700"
            onClick={() => {
              console.log('View course with ID:', value);
            }}
          >
            View
          </button>
          <button
            className="p-1 px-4 rounded-md bg-secondary-800 hover:bg-secondary-700 text-white-100"
            onClick={() => {
              console.log('Edit course with ID:', value);
            }}
          >
            Edit
          </button>
          <button
            className="p-1 px-4 rounded-md bg-red-500 hover:bg-red-700 text-white-100"
            onClick={() => {
              console.log('Delete course with ID:', value);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminTemplate activeNav="kursus">
      <div className="bg-white-100 p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Kursus</h2>
          <Button
            variant="primary"
            className="flex items-center px-2 gap-2"
            to={'/admin/kursus/tambah'}
          >
            <Icon type="plus" className="size-6" color="black" />
            <span className="text-lg font-normal">Kursus</span>
          </Button>
        </div>
        {!token ? (
          <div className="text-center text-red-500 py-8">Anda belum login.</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <ReactTable
            columns={columns}
            data={courses}
            numbering={true}
            onSortChange={handleSortChange}
            pagination={{ ...pagination, perPage }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            enableFiltering={true}
          />
        )}
      </div>
    </AdminTemplate>
  );
}
