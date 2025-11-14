import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStudentCourseStore from '../../../../../../zustand/studentCourseStore';
import ReactTable from '../../../../../../components/table/reactTable';
import Icon from '../../../../../../components/icons/icon';
import TableFilter from '../../../../../../components/table/tableFilter';

const BASE_IMAGE_URL = process.env.REACT_APP_BACKEND_BASE_URL + '/storage/';

export default function Siswa() {
  const { id } = useParams();
  const {
    students,
    pagination,
    loading,
    error,
    fetchStudents,
    setPagination,
    filters,
    setFilters,
  } = useStudentCourseStore();

  // State untuk search input (nama)
  const [searchInput, setSearchInput] = useState(filters.name || '');

  // Pastikan pagination selalu memiliki nilai default dan bertipe number
  const safePagination = {
    ...pagination,
    currentPage: Number(pagination?.currentPage) || 1,
    perPage: Number(pagination?.perPage) || 10,
    lastPage: Number(pagination?.lastPage) || 1,
  };

  // Filter config
  const filterConfig = [
    {
      key: 'name',
      label: 'Cari Nama',
      type: 'search',
      withButton: true,
      placeholder: 'Nama Peserta',
    },
  ];

  // Fetch data saat filter, id, atau pagination berubah
  useEffect(() => {
    fetchStudents(id, {
      page: safePagination.currentPage,
      perPage: safePagination.perPage,
      filters,
    });
    // eslint-disable-next-line
  }, [id, safePagination.currentPage, safePagination.perPage, filters]);

  // Handler filter berubah
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...safePagination, currentPage: 1 }); // reset ke page 1 saat filter berubah
  };

  const columns = [
    {
      Header: 'Foto',
      accessor: 'photo_profile',
      Cell: ({ value }) =>
        value ? (
          <img
            src={value}
            alt="Foto Profil"
            className="w-10 h-10 rounded-full object-cover mx-auto"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
            <Icon type="user" className="w-6 h-6 text-gray-400" />
          </div>
        ),
      width: 60,
      disableSort: true,
    },
    {
      Header: 'Nama',
      accessor: 'full_name',
      Cell: ({ value }) => value || '-',
      disableSort: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: ({ value }) => value || '-',
      disableSort: true,
    },
    {
      Header: 'Tanggal Bergabung',
      accessor: 'enrolled_at',
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      disableSort: true,
    },
  ];

  const handlePageChange = (page) => {
    if (page < 1 || page > safePagination.lastPage) return;
    setPagination({ ...safePagination, currentPage: page });
  };

  const handlePageSizeChange = (size) => {
    setPagination({ ...safePagination, perPage: size, currentPage: 1 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-0">Daftar Peserta</p>
      </div>
      <TableFilter
        filters={filterConfig}
        values={filters}
        onFilterChange={handleFilterChange}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <ReactTable
        columns={columns}
        data={students}
        numbering
        pagination={safePagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />
    </div>
  );
}
