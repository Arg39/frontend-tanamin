import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import ReactTable from '../../../../components/table/reactTable';
import Icon from '../../../../components/icons/icon';

const dummyData = {
  status: 'success',
  message: 'FAQ retrieved successfully',
  httpCode: 200,
  data: {
    items: [
      {
        id: '1',
        question: 'Apa itu Tanamin?',
        answer: 'Tanamin adalah platform digital untuk pertanian modern di Indonesia.',
      },
      {
        id: '2',
        question: 'Bagaimana cara mendaftar sebagai petani?',
        answer: 'Klik tombol daftar di halaman utama dan isi data diri Anda.',
      },
      {
        id: '3',
        question: 'Apakah Tanamin gratis?',
        answer: 'Ya, semua layanan dasar Tanamin dapat digunakan secara gratis.',
      },
    ],
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 3,
      per_page: 10,
    },
  },
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
    Cell: ({ value, row }) => (
      <div className="flex flex-col gap-2 items-start">
        <button className="p-1 px-4 rounded-md bg-primary-700 hover:bg-primary-800 text-white">
          Edit
        </button>
        <button className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white">
          Hapus
        </button>
      </div>
    ),
  },
];

export default function FaqAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'FAQ', path: location.pathname }];
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    currentPage: dummyData.data.pagination.current_page,
    lastPage: dummyData.data.pagination.last_page,
    perPage: dummyData.data.pagination.per_page,
  });

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
    // fetch data here if using API
  };

  const handlePageSizeChange = (size) => {
    setPagination((prev) => ({
      ...prev,
      perPage: size,
      currentPage: 1,
    }));
    // fetch data here if using API
  };

  return (
    <AdminTemplate activeNav={'faq'} breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">
            Daftar Frequently Asked Questions
          </h2>
          <button className="flex gap-2 p-2 px-4 items-center text-white bg-primary-700 hover:bg-primary-800 rounded-md">
            <Icon type={'plus'} className={'w-6 h-6'} />
            Tambah
          </button>
        </div>
        <ReactTable
          columns={columns}
          data={dummyData.data.items}
          numbering={true}
          pagination={{
            currentPage: pagination.currentPage,
            lastPage: pagination.lastPage,
            perPage: pagination.perPage,
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={false}
        />
      </div>
    </AdminTemplate>
  );
}
