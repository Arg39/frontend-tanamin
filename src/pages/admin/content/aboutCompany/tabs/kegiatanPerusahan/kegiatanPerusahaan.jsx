import React, { useEffect } from 'react';
import ReactTable from '../../../../../../components/table/reactTable';
import Icon from '../../../../../../components/icons/icon';
import useCompanyActivityStore from '../../../../../../zustand/companyActivityStore';
import { useNavigate } from 'react-router-dom';

export default function KegiatanPerusahaan() {
  const {
    activities,
    pagination,
    loading,
    fetchActivities,
    perPage,
    setPagination,
    deleteActivity, // assumed to exist in your store
  } = useCompanyActivityStore();
  const navigate = useNavigate();

  const columns = [
    {
      Header: 'Gambar',
      accessor: 'image',
      width: '30%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="flex justify-center items-center">
          <img src={value} alt="Kegiatan" className="h-28 object-cover rounded shadow border" />
        </div>
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
      width: '30%',
      Cell: ({ value }) => <span className="block whitespace-pre-line">{value}</span>,
      disableSort: true,
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="flex flex-col gap-2 items-start">
          <button
            className="p-1 px-4 rounded-md bg-primary-700 hover:bg-primary-800 text-white"
            onClick={() => navigate(`/admin/tentang-perusahaan/kegiatan/edit/${value}`)}
          >
            Edit
          </button>
          <button
            className="p-1 px-4 rounded-md bg-error-600 hover:bg-error-700 text-white"
            onClick={() => {
              if (window.confirm('Yakin ingin menghapus kegiatan ini?')) {
                deleteActivity(value);
              }
            }}
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchActivities({ page: pagination.currentPage, perPage });
  }, [pagination.currentPage, perPage, fetchActivities]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handlePageSizeChange = (size) => {
    setPagination({ ...pagination, perPage: size, currentPage: 1 });
  };

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-4">Kegiatan Perusahaan</h2>
        <button
          className="flex gap-2 p-2 px-4 items-center text-white bg-primary-700 hover:bg-primary-800 rounded-md"
          onClick={() => {
            navigate('/admin/tentang-perusahaan/kegiatan/tambah');
          }}
        >
          <Icon type={'plus'} className={'w-6 h-6'} />
          Tambah
        </button>
      </div>
      <ReactTable
        columns={columns}
        data={activities}
        numbering={true}
        pagination={{
          currentPage: pagination?.currentPage ?? 1,
          lastPage: pagination?.lastPage ?? 1,
          perPage: pagination?.perPage ?? perPage ?? 10,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />
    </>
  );
}
