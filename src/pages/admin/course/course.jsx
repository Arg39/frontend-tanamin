import { useEffect, useState } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCourseStore from '../../../zustand/courseStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';
import useAuthStore from '../../../zustand/authStore';
import useCategoryStore from '../../../zustand/categoryStore';
import useInstructorStore from '../../../zustand/instructorStore';
import TableFilter from '../../../components/table/tableFilter';

export default function Course() {
  const { courses, fetchCourses, pagination, sortBy, sortOrder, perPage, error, loading } =
    useCourseStore();
  const { token } = useAuthStore();
  const { categories, fetchCategoryOptions } = useCategoryStore();
  const { instructorSelectOptions, fetchInstructoryOptions } = useInstructorStore();

  const [filterValues, setFilterValues] = useState({
    search: '',
    category: '',
    instructor: '',
    date: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchCategoryOptions();
    fetchInstructoryOptions();
  }, []);

  useEffect(() => {
    setSearchInput(filterValues.search || '');
  }, [filterValues.search]);

  useEffect(() => {
    if (token) {
      fetchCourses({
        sortBy,
        sortOrder,
        perPage,
        page: pagination.currentPage,
        search: filterValues.search,
        category: filterValues.category,
        instructor: filterValues.instructor,
        dateStart: filterValues.date.start,
        dateEnd: filterValues.date.end,
      });
    }
  }, [token, sortBy, sortOrder, perPage, pagination.currentPage, filterValues]);

  const handleSortChange = (column, order) => {
    fetchCourses({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageChange = (page) => {
    fetchCourses({
      sortBy,
      sortOrder,
      perPage,
      page,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchCourses({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  // Filtering table
  const filterConfigs = [
    {
      key: 'search',
      type: 'search',
      label: 'Cari Judul',
      placeholder: 'Cari kursus...',
      withButton: true, // tambahkan properti ini
    },
    {
      key: 'category',
      type: 'select',
      label: 'Kategori',
      placeholder: 'Semua Kategori',
      options: categories.map((cat) => ({ value: cat.id, label: cat.name })),
    },
    {
      key: 'instructor',
      type: 'select',
      label: 'Instruktur',
      placeholder: 'Semua Instruktur',
      options: instructorSelectOptions,
    },
    {
      key: 'date',
      type: 'dateRange',
      label: 'Tanggal',
    },
  ];

  // Table columns
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
          <>
            <h4 className="mb-4 md:mb-2">Filtering</h4>
            <div className="mb-2 md:mb-6">
              <TableFilter
                filters={filterConfigs}
                values={filterValues}
                onFilterChange={setFilterValues}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            </div>
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
            />
          </>
        )}
      </div>
    </AdminTemplate>
  );
}
