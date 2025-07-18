import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import ReactTable from '../../../../components/table/reactTable';
import Icon from '../../../../components/icons/icon';
import useFaqStore from '../../../../zustand/faqStore';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function FaqAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'FAQ', path: location.pathname }];
  const navigate = useNavigate();

  const { faqs, pagination, loading, fetchFaqs, setPagination, deleteFaq } = useFaqStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  // Helper to extract items and pagination from API response
  const faqItems = faqs?.items || faqs || [];
  const currentPagination =
    pagination?.current_page !== undefined
      ? {
          currentPage: pagination.current_page,
          lastPage: pagination.last_page,
          perPage: pagination.per_page || pagination.perPage || 10,
        }
      : {
          currentPage: pagination.currentPage || 1,
          lastPage: pagination.lastPage || 1,
          perPage: pagination.perPage || 10,
        };

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line
  }, []);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current_page: page });
    fetchFaqs({ page, perPage: currentPagination.perPage });
  };

  const handlePageSizeChange = (size) => {
    setPagination({ ...pagination, perPage: size, current_page: 1 });
    fetchFaqs({ page: 1, perPage: size });
  };

  const handleDelete = (id) => {
    openModal({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus FAQ ini?',
      variant: 'danger',
      onConfirm: async () => {
        closeModal();
        try {
          await deleteFaq(id);
          toast.success('FAQ berhasil dihapus');
          fetchFaqs();
        } catch (error) {
          toast.error(error.message || 'Gagal menghapus FAQ');
        }
      },
      onCancel: () => closeModal(),
    });
  };

  const columns = [
    {
      Header: 'Pertanyaan',
      accessor: 'question',
      width: '30%',
    },
    {
      Header: 'Jawaban',
      accessor: 'answer',
      width: '60%',
      Cell: ({ value }) => <span className="block whitespace-pre-line">{value}</span>,
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      Cell: ({ value }) => (
        <div className="flex flex-col gap-2 items-start">
          <button
            className="p-1 px-4 rounded-md bg-primary-700 hover:bg-primary-800 text-white"
            onClick={() => navigate(`/admin/faq/edit/${value}`)}
            disabled={loading}
          >
            Edit
          </button>
          <button
            className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white"
            onClick={() => handleDelete(value)}
            disabled={loading}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminTemplate activeNav={'faq'} breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">
            Daftar Frequently Asked Questions
          </h2>
          <button
            className="flex gap-2 p-2 px-4 items-center text-white bg-primary-700 hover:bg-primary-800 rounded-md"
            onClick={() => navigate('/admin/faq/tambah')}
          >
            <Icon type={'plus'} className={'w-6 h-6'} />
            Tambah
          </button>
        </div>
        <ReactTable
          columns={columns}
          data={faqItems}
          numbering={true}
          pagination={currentPagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
        />
      </div>
    </AdminTemplate>
  );
}
