import React, { useEffect } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import ReactTable from '../../../../components/table/reactTable';
import useIncomeStore from '../../../../zustand/incomeStore';
import { useLocation } from 'react-router-dom';

export default function Income() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Pendapatan', path: location.pathname }];

  const {
    dailyIncome,
    fetchDailyIncome,
    pagination,
    perPage,
    loading,
    error,
    sortBy,
    sortOrder,
    setSort,
  } = useIncomeStore();

  useEffect(() => {
    fetchDailyIncome({
      perPage,
      page: pagination.currentPage,
      sortBy,
      sortOrder,
    });
  }, [perPage, pagination.currentPage, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    fetchDailyIncome({
      perPage,
      page,
      sortBy,
      sortOrder,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchDailyIncome({
      perPage: size,
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const handleSortChange = (columnId, order) => {
    setSort(columnId, order);
  };

  const formatRupiah = (angka) => {
    if (!angka) return '-';
    return 'Rp. ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const columns = [
    {
      Header: 'Tanggal',
      accessor: 'date',
      width: '30%',
      disableSort: false,
      Cell: ({ value }) => value || '-',
    },
    {
      Header: 'Total Pendapatan',
      accessor: 'total_income',
      width: '35%',
      Cell: ({ value }) => <span>{formatRupiah(value)}</span>,
      disableSort: true,
    },
    {
      Header: 'Total Enroll Lunas',
      accessor: 'total_paid_enrollments',
      width: '35%',
      Cell: ({ value }) => value || 0,
      disableSort: true,
    },
  ];

  return (
    <AdminTemplate activeNav="pendapatan" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Pendapatan</h2>
        <div>
          {error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <ReactTable
              columns={columns}
              data={dailyIncome}
              numbering={true}
              pagination={{
                currentPage: pagination.currentPage,
                lastPage: pagination.lastPage,
                perPage,
              }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      </div>
    </AdminTemplate>
  );
}
