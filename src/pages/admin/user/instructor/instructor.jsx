import React, { useEffect, useState } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import useInstructorStore from '../../../../zustand/instructorStore';
import ReactTable from '../../../../components/table/reactTable';
import Button from '../../../../components/button/button';
import Icon from '../../../../components/icons/icon';
import TableFilter from '../../../../components/table/tableFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfileStore from '../../../../zustand/profileStore';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';

export default function Instructor() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = [{ label: 'Instruktur', path: location.pathname }];

  const { instructors, fetchInstructors, pagination, sortBy, sortOrder, perPage, error } =
    useInstructorStore();
  const { updateUserStatus, deleteUserProfile } = useProfileStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  // State untuk filter
  const [filterValues, setFilterValues] = useState({
    name: '',
    created_at: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  // Fetch data awal
  useEffect(() => {
    fetchInstructors({ sortBy: 'Nama', sortOrder: 'asc' });
  }, [fetchInstructors]);

  // Fungsi handle filter
  const handleFilterChange = (values) => {
    setFilterValues(values);
    fetchInstructors({
      sortBy,
      sortOrder,
      perPage,
      page: 1,
      filters: values,
    });
  };

  const handleSortChange = (column, order) => {
    fetchInstructors({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      filters: filterValues,
    });
  };

  const handlePageChange = (page) => {
    fetchInstructors({
      sortBy,
      sortOrder,
      perPage,
      page,
      filters: filterValues,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchInstructors({
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
          fetchInstructors({
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

  const handleDelete = async (value) => {
    openModal({
      title: 'Konfirmasi Penghapusan',
      message: 'Apakah Anda yakin ingin menghapus instruktur ini?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteUserProfile(value);
          fetchInstructors({
            sortBy,
            sortOrder,
            perPage,
            page: pagination.currentPage,
            filters: filterValues,
          });
          toast.success('Instruktur berhasil dihapus');
        } catch (e) {
          toast.error(`Gagal menghapus instruktur: ${e.message}`);
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
      placeholder: 'Nama instruktur',
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
                navigate(`/admin/instruktur/${value}`);
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
            <button
              className="p-1 px-4 rounded-md bg-red-700 hover:bg-red-800 text-white"
              onClick={() => {
                handleDelete(value);
              }}
            >
              Hapus
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTemplate activeNav="instruktur" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Instruktur</h2>
          <Button
            variant="primary"
            className="flex items-center px-2 gap-2"
            to={'/admin/instruktur/tambah'}
          >
            <Icon type="plus" className="size-6" color="black" />
            <span className="text-lg font-normal">instruktur</span>
          </Button>
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
          data={instructors}
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
