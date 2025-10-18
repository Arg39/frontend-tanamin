import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../../template/templateAdmin';
import Icon from '../../../../../components/icons/icon';
import Button from '../../../../../components/button/button';
import ReactTable from '../../../../../components/table/reactTable';
import useCouponStore from '../../../../../zustand/couponStore';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';
import useAuthStore from '../../../../../zustand/authStore';

export default function Coupon() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useConfirmationModalStore();

  const { user } = useAuthStore();

  const {
    coupons = [],
    pagination = { current_page: 1, last_page: 1, perPage: 10, total: 0 },
    sortBy,
    sortOrder,
    perPage,
    fetchCoupons,
    error,
    loading,
    deleteCoupon,
  } = useCouponStore();

  // Fetch coupons on mount and when pagination/sorting changes
  useEffect(() => {
    fetchCoupons({
      sortBy,
      sortOrder,
      perPage,
      page: pagination.current_page,
    });
  }, [sortBy, sortOrder, perPage, pagination.current_page, fetchCoupons]);

  function formatRupiah(value) {
    if (typeof value !== 'number') value = Number(value);
    return `Rp. ${value.toLocaleString('id-ID')}`;
  }
  const columns = [
    {
      Header: 'Nama',
      accessor: 'title',
      width: '20%',
    },
    {
      Header: 'Kode',
      accessor: 'code',
      disableSort: true,
      width: '15%',
    },
    {
      Header: 'Diskon',
      disableSort: true,
      accessor: (row) => (row.type === 'percent' ? `${row.value}%` : formatRupiah(row.value)),
      width: '13%',
    },
    {
      Header: 'Penggunaan',
      disableSort: true,
      accessor: (row) => `${row.used_count} / ${row.max_usage}`,
      width: '10%',
      Cell: ({ row }) => (
        <span>
          {row.original.used_count} / {row.original.max_usage}
        </span>
      ),
    },
    {
      Header: 'Status',
      accessor: 'is_active',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <span
          className={`w-fit px-2 py-1 rounded inline-block ${
            value ? 'bg-primary-100 text-primary-700' : 'bg-error-200 text-error-700'
          }`}
        >
          {value ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
    {
      Header: 'Masa Berlaku',
      disableSort: true,
      accessor: (row) => `${row.start_at} - ${row.end_at}`,
      width: '18%',
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
            to={
              user?.role === 'admin'
                ? `/admin/kupon/${value}/edit`
                : `/instruktur/kupon/${value}/edit`
            }
          >
            Edit
          </Link>

          <button
            className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white"
            onClick={() => {
              openModal({
                title: 'Konfirmasi hapus',
                message: 'Apakah Anda yakin menghapus kupon ini?',
                onConfirm: async () => {
                  try {
                    await deleteCoupon(value);
                    fetchCoupons({
                      sortBy,
                      sortOrder,
                      perPage,
                      page: pagination.current_page,
                    });
                  } finally {
                    closeModal();
                  }
                },
                onCancel: () => {
                  closeModal();
                },
              });
            }}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const handleSortChange = (columnId, order) => {
    fetchCoupons({
      sortBy: columnId,
      sortOrder: order,
      perPage,
      page: pagination.current_page,
    });
  };

  const handlePageChange = (page) => {
    fetchCoupons({
      sortBy,
      sortOrder,
      perPage,
      page,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchCoupons({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
    });
  };

  // Ensure coupons is always an array
  const couponItems = Array.isArray(coupons) ? coupons : [];

  // Ensure pagination object has perPage
  const paginationObj = {
    currentPage: pagination.current_page || 1,
    lastPage: pagination.last_page || 1,
    perPage: pagination.perPage || perPage || 10,
    total: pagination.total || couponItems.length,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
        <h2 className="text-2xl font-bold">Daftar Kupon</h2>
        <Button
          variant="primary"
          className="flex items-center px-2 gap-2"
          to={user.role === 'admin' ? '/admin/kupon/tambah' : '/instruktur/kupon/tambah'}
        >
          <Icon type="plus" className="size-6" color="black" />
          <span className="text-lg font-normal">Kupon</span>
        </Button>
      </div>

      {/* Coupon Table */}
      <ReactTable
        columns={columns}
        data={couponItems}
        numbering={true}
        onSortChange={handleSortChange}
        pagination={paginationObj}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
      />
    </div>
  );
}
