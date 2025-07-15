import React, { useState } from 'react';
import ReactTable from '../../../../../components/table/reactTable';
import Icon from '../../../../../components/icons/icon';

const dummyData = {
  status: 'success',
  message: 'Kegiatan retrieved successfully',
  httpCode: 200,
  data: {
    items: [
      {
        id: '1',
        image: 'https://via.placeholder.com/120x80?text=Kegiatan+1',
        title: 'Pelatihan Petani Digital',
        description: 'Pelatihan penggunaan aplikasi pertanian digital untuk petani.',
      },
      {
        id: '2',
        image: 'https://via.placeholder.com/120x80?text=Kegiatan+2',
        title: 'Panen Raya Bersama',
        description: 'Kegiatan panen raya bersama mitra dan petani binaan.',
      },
      {
        id: '3',
        image: 'https://via.placeholder.com/120x80?text=Kegiatan+3',
        title: 'Sosialisasi Teknologi',
        description: 'Sosialisasi teknologi pertanian terbaru di desa mitra.',
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
    Header: 'Gambar',
    accessor: 'image',
    width: '30%',
    disableSort: true,
    Cell: ({ value }) => (
      <img src={value} alt="Kegiatan" className="w-24 h-16 object-cover rounded shadow border" />
    ),
  },
  {
    Header: 'Judul',
    accessor: 'title',
    width: '20%',
  },
  {
    Header: 'Deskripsi',
    accessor: 'description',
    width: '40%',
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

export default function KegiatanPerusahaan() {
  // Simulasi state untuk pagination (jika ingin dikembangkan)
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
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">Kegiatan Perusahaan</h2>
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
