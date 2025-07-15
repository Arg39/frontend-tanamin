import React, { useState } from 'react';
import ReactTable from '../../../../../components/table/reactTable';
import Icon from '../../../../../components/icons/icon';

const dummyData = {
  status: 'success',
  message: 'Partnerships retrieved successfully',
  httpCode: 200,
  data: {
    items: [
      {
        id: '1',
        partner_name: 'PT Mitra Tani',
        logo: 'https://via.placeholder.com/120x80?text=Mitra+Tani',
        website_url: 'https://mitratani.co.id',
      },
      {
        id: '2',
        partner_name: 'CV Agro Jaya',
        logo: 'https://via.placeholder.com/120x80?text=Agro+Jaya',
        website_url: 'https://agrojaya.com',
      },
      {
        id: '3',
        partner_name: 'Farmers United',
        logo: 'https://via.placeholder.com/120x80?text=Farmers+United',
        website_url: '',
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
    Header: 'Logo',
    accessor: 'logo',
    width: '20%',
    disableSort: true,
    Cell: ({ value }) => (
      <img
        src={value}
        alt="Logo Partner"
        className="w-24 h-16 object-cover rounded shadow border"
      />
    ),
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

export default function KerjaSama() {
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
    <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">
          Kerja Sama Perusahaan
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
  );
}
