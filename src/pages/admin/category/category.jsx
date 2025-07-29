import React, { useEffect, useState } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCategoryStore from '../../../zustand/categoryStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import TableFilter from '../../../components/table/tableFilter';
import { Link, useLocation } from 'react-router-dom';

export default function Category() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kategori', path: location.pathname }];

  const {
    categories,
    fetchCategories,
    pagination,
    sortBy,
    sortOrder,
    perPage,
    error,
    deleteCategory,
  } = useCategoryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState({
    search: '',
    dateRange: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setSearchInput(filterValues.search || '');
  }, [filterValues.search]);

  const fetchData = (params) => {
    setIsLoading(true); // Set loading ke true sebelum fetching
    fetchCategories(params).finally(() => setIsLoading(false)); // Set loading ke false setelah selesai
  };

  useEffect(() => {
    fetchData({
      sortBy,
      sortOrder,
      perPage,
      page: pagination.currentPage,
      name: filterValues.search,
      dateRange: filterValues.dateRange,
    });
  }, [sortBy, sortOrder, perPage, pagination.currentPage, filterValues]);

  const handleSortChange = (column, order) => {
    fetchData({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      name: filterValues.search,
      dateRange: filterValues.dateRange,
    });
  };

  const handlePageChange = (page) => {
    fetchData({
      sortBy,
      sortOrder,
      perPage,
      page,
      name: filterValues.search,
      dateRange: filterValues.dateRange,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchData({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      name: filterValues.search,
      dateRange: filterValues.dateRange,
    });
  };

  const openModal = useConfirmationModalStore((state) => state.openModal);

  const filterConfigs = [
    {
      key: 'search',
      type: 'search',
      label: 'Cari Nama',
      placeholder: 'Cari kategori...',
      withButton: true,
    },
    {
      key: 'dateRange',
      type: 'dateRange',
      label: 'Tanggal',
    },
  ];

  const columns = [
    {
      Header: 'Nama',
      accessor: 'name',
      width: '20%',
    },
    {
      Header: 'Gambar',
      accessor: 'image',
      width: '45%',
      disableSort: true,
      Cell: ({ value }) => (
        <img
          src={`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${value}`}
          alt="Category"
          className="sm:mx-auto h-24 object-cover rounded"
        />
      ),
    },
    {
      Header: 'penggunaan',
      accessor: 'used',
      width: '5%',
      disableSort: true,
      Cell: ({ value }) => <p className="flex md:justify-center">{value} Kursus</p>,
    },
    {
      Header: 'Tanggal',
      accessor: 'updated_at',
      width: '15%',
      Cell: ({ value }) => {
        if (!value) return '-';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(date);
      },
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="w-fit flex flex-col gap-2 justify-center items-start text-md">
          <Link
            className="p-1 px-4 rounded-md bg-secondary-500 hover:bg-secondary-600 text-white"
            to={`/admin/kategori/edit/${value}`}
          >
            Edit
          </Link>
          <button
            className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white"
            onClick={() => {
              openModal({
                title: 'Konfirmasi hapus',
                message: 'Apakah Anda yakin menghapus kategori ini?',
                onConfirm: () => {
                  deleteCategory(value);
                },
                onCancel: () => {},
              });
            }}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminTemplate activeNav="kategori" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold">Daftar Kategori</h2>
          <Button
            variant="primary"
            className="flex items-center px-2 gap-2"
            to={'/admin/kategori/tambah'}
          >
            <Icon type="plus" className="size-6" color="black" />
            <span className="text-lg font-normal">Kategori</span>
          </Button>
        </div>
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
        {error && <p className="text-red-500">{error}</p>}
        <ReactTable
          columns={columns}
          data={categories}
          numbering={true}
          onSortChange={handleSortChange}
          pagination={{ ...pagination, perPage }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          loading={isLoading}
        />
      </div>
    </AdminTemplate>
  );
}
