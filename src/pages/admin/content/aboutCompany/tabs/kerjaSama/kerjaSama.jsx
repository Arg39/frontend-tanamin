import React, { useEffect } from 'react';
import ReactTable from '../../../../../../components/table/reactTable';
import Icon from '../../../../../../components/icons/icon';
import useCompanyPartnershipStore from '../../../../../../zustand/companyPartnershipStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../../../zustand/confirmationModalStore';

export default function KerjaSama() {
  const navigate = useNavigate();
  const {
    partnerships,
    pagination,
    loading,
    error,
    fetchPartnerships,
    setPagination,
    deletePartnership,
  } = useCompanyPartnershipStore();

  const { openModal, closeModal } = useConfirmationModalStore();

  // Handler untuk hapus partnership dengan konfirmasi dan toast
  const handleDelete = (id) => {
    openModal({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus data kerja sama ini?',
      variant: 'error',
      onConfirm: async () => {
        closeModal();
        try {
          await deletePartnership(id);
          toast.success('Data kerja sama berhasil dihapus');
          // fetchPartnerships sudah dipanggil di store setelah delete
        } catch (err) {
          toast.error(err.message || 'Gagal menghapus data');
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  // Columns didefinisikan di dalam komponen agar bisa akses navigate dan handleDelete
  const columns = [
    {
      Header: 'Logo',
      accessor: 'logo',
      width: '20%',
      disableSort: true,
      Cell: ({ value }) => <img src={value} alt="Logo Partner" className="h-16 object-cover " />,
    },
    {
      Header: 'Nama Partner',
      accessor: 'partner_name',
      width: '30%',
    },
    {
      Header: 'Website',
      accessor: 'website_url',
      width: '30%',
      Cell: ({ value }) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-700 underline"
          >
            {value}
          </a>
        ) : (
          <span className="text-gray-400 italic">Tidak tersedia</span>
        ),
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '20%',
      Cell: ({ value }) => (
        <div className="flex flex-col gap-2 items-start">
          <button
            className="p-1 px-4 rounded-md bg-primary-700 hover:bg-primary-800 text-white"
            onClick={() => navigate(`/admin/tentang-perusahaan/kerja-sama/edit/${value}`)}
          >
            Edit
          </button>
          <button
            className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white"
            onClick={() => handleDelete(value)}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    fetchPartnerships({
      page: pagination.currentPage,
      perPage: pagination.perPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.perPage]);

  // Pastikan data dan pagination dikonversi ke format yang benar
  const tableData = Array.isArray(partnerships) ? partnerships : [];
  const tablePagination = {
    currentPage: pagination.currentPage || 1,
    lastPage: pagination.lastPage || 1,
    perPage: pagination.perPage || 10,
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
  };

  const handlePageSizeChange = (size) => {
    setPagination({
      ...pagination,
      perPage: size,
      currentPage: 1,
    });
  };

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">
          Kerja Sama Perusahaan
        </h2>
        <button
          className="flex gap-2 p-2 px-4 items-center text-white bg-primary-700 hover:bg-primary-800 rounded-md"
          onClick={() => navigate('/admin/tentang-perusahaan/kerja-sama/tambah')}
        >
          <Icon type={'plus'} className={'w-6 h-6'} />
          Tambah
        </button>
      </div>
      {error && <div className="mb-2 text-error-600 bg-error-50 p-2 rounded">{error}</div>}
      <ReactTable
        columns={columns}
        data={tableData}
        numbering={true}
        pagination={tablePagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />
    </>
  );
}
