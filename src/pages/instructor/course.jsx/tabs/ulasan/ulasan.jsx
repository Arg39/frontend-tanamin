import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStudentCourseStore from '../../../../../zustand/studentCourseStore';
import ReactTable from '../../../../../components/table/reactTable';
import TableFilter from '../../../../../components/table/tableFilter';
import Icon from '../../../../../components/icons/icon';

export default function UlasanCourse() {
  const { id } = useParams();
  const {
    reviews,
    reviewsPagination,
    reviewsLoading,
    reviewsError,
    fetchReviews,
    setReviewsPagination,
    reviewsFilters,
    setReviewsFilters,
  } = useStudentCourseStore();

  const [searchInput, setSearchInput] = useState(reviewsFilters.name || '');

  const safePagination = {
    ...reviewsPagination,
    currentPage: Number(reviewsPagination?.currentPage) || 1,
    perPage: Number(reviewsPagination?.perPage) || 10,
    lastPage: Number(reviewsPagination?.lastPage) || 1,
  };

  const filterConfig = [
    {
      key: 'name',
      label: 'Cari Nama',
      type: 'search',
      withButton: true,
      placeholder: 'Nama siswa',
    },
    {
      key: 'rating',
      label: 'Rating',
      type: 'select',
      options: [
        { value: '', label: 'Semua' },
        { value: '5', label: '5' },
        { value: '4', label: '4' },
        { value: '3', label: '3' },
        { value: '2', label: '2' },
        { value: '1', label: '1' },
      ],
      placeholder: 'Pilih rating',
    },
  ];

  useEffect(() => {
    fetchReviews(id, {
      page: safePagination.currentPage,
      perPage: safePagination.perPage,
      filters: reviewsFilters,
    });
    // eslint-disable-next-line
  }, [id, safePagination.currentPage, safePagination.perPage, reviewsFilters]);

  const handleFilterChange = (newFilters) => {
    setReviewsFilters(newFilters);
    setReviewsPagination({ ...safePagination, currentPage: 1 });
  };

  const columns = [
    {
      Header: 'Foto',
      accessor: (row) => row.user?.photo_profile,
      Cell: ({ value, row }) =>
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
      accessor: (row) => row.user?.full_name || row.user?.name,
      Cell: ({ value }) => value || '-',
      disableSort: true,
    },
    {
      Header: 'Email',
      accessor: (row) => row.user?.email,
      Cell: ({ value }) => value || '-',
      disableSort: true,
    },
    {
      Header: 'Rating',
      accessor: 'rating',
      Cell: ({ value }) => (
        <span className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} type="star" className={i < value ? 'text-yellow-400' : 'text-gray-300'} />
          ))}
          <span className="ml-1 text-sm text-gray-600">{value || '-'}</span>
        </span>
      ),
      width: 120,
      disableSort: true,
    },
    {
      Header: 'Komentar',
      accessor: 'comment',
      Cell: ({ value }) => value || '-',
      disableSort: true,
    },
    {
      Header: 'Tanggal',
      accessor: 'created_at',
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      width: 120,
      disableSort: true,
    },
  ];

  const handlePageChange = (page) => {
    if (page < 1 || page > safePagination.lastPage) return;
    setReviewsPagination({ ...safePagination, currentPage: page });
  };

  const handlePageSizeChange = (size) => {
    setReviewsPagination({ ...safePagination, perPage: size, currentPage: 1 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl sm:text-2xl font-bold text-primary-800 mb-2 sm:mb-0">Daftar Ulasan</p>
      </div>
      <TableFilter
        filters={filterConfig}
        values={reviewsFilters}
        onFilterChange={handleFilterChange}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {reviewsError && <div className="text-red-500 mb-2">{reviewsError}</div>}
      <ReactTable
        columns={columns}
        data={reviews}
        numbering
        pagination={safePagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={reviewsLoading}
      />
    </div>
  );
}
