import React, { useEffect, useState } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import useStudentStore from '../../../../zustand/studentStore';
import ReactTable from '../../../../components/table/reactTable';
import Button from '../../../../components/button/button';
import Icon from '../../../../components/icons/icon';
import TableFilter from '../../../../components/table/tableFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfileStore from '../../../../zustand/profileStore';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function Student() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [{ label: 'Peserta', path: location.pathname }];

  const { students, fetchStudents, pagination, sortBy, sortOrder, perPage, error } =
    useStudentStore();
  const { updateUserStatus } = useProfileStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  // State untuk filter
  const [filterValues, setFilterValues] = useState({
    name: '',
    created_at: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  // Fetch data awal
  useEffect(() => {
    fetchStudents({ sortBy: 'first_name', sortOrder: 'asc' });
  }, [fetchStudents]);

  // Fungsi handle filter
  const handleFilterChange = (values) => {
    setFilterValues(values);
    fetchStudents({
      sortBy,
      sortOrder,
      perPage,
      page: 1,
      filters: values,
    });
  };

  const handleSortChange = (column, order) => {
    fetchStudents({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      filters: filterValues,
    });
  };

  const handlePageChange = (page) => {
    fetchStudents({
      sortBy,
      sortOrder,
      perPage,
      page,
      filters: filterValues,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchStudents({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      filters: filterValues,
    });
  };

  const handleChangeStatus = async (value, isActive) => {
    openModal({
      title: 'Konfirmasi Perubahan Status',
      message: 'Apakah Anda yakin ingin mengubah status instruktur ini?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await updateUserStatus(value, isActive ? 'inactive' : 'active');
          fetchStudents({
            sortBy,
            sortOrder,
            perPage,
            page: pagination.currentPage,
            filters: filterValues,
          });
        } catch (e) {
          toast.error(`Gagal mengubah status: ${e.message}`);
        }
      },
      onCancel: closeModal,
    });
  };

  // Konfigurasi filter
  const filters = [
    {
      key: 'name',
      label: 'Cari Nama',
      type: 'search',
      withButton: true,
      placeholder: 'Nama Peserta',
    },
    {
      key: 'created_at',
      label: 'Tanggal Bergabung',
      type: 'dateRange',
      placeholder: 'Pilih rentang tanggal',
    },
  ];

  const columns = [
    {
      Header: 'Nama',
      accessor: (row) => `${row.first_name} ${row.last_name}`,
      width: '30%',
      Cell: ({ value }) => <span>{value}</span>,
    },
    {
      Header: 'Email',
      accessor: 'email',
      width: '25%',
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: '15%',
      disableSort: true,
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: 'Tanggal bergabung',
      accessor: 'created_at',
      width: '20%',
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
      Cell: ({ value, row }) => {
        const status = row.original.status;
        const isActive = status === 'active';
        return (
          <div className="w-fit flex flex-row md:flex-col gap-2 justify-center items-start text-md mt-2 md:mt-0">
            <button
              className="p-1 px-4 rounded-md bg-primary-700 text-white hover:bg-primary-800"
              onClick={() => {
                navigate(`/admin/peserta/${value}`);
              }}
            >
              Lihat
            </button>
            <button
              className={`p-1 px-4 rounded-md text-white ${
                isActive ? 'bg-warning-500 hover:bg-warning-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={async () => {
                handleChangeStatus(value, isActive);
              }}
            >
              {isActive ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTemplate activeNav="peserta" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Peserta</h2>
        </div>
        {/* Filter */}
        <TableFilter
          filters={filters}
          values={filterValues}
          onFilterChange={handleFilterChange}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        {error && <p className="text-red-500">{error}</p>}
        <ReactTable
          columns={columns}
          data={students}
          numbering={true}
          onSortChange={handleSortChange}
          pagination={{ ...pagination, perPage }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>
    </AdminTemplate>
  );
}
