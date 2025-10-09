import React, { useEffect, useState } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import { useLocation } from 'react-router-dom';
import ReactTable from '../../../../components/table/reactTable';
import TableFilter from '../../../../components/table/tableFilter';
import useCourseTransactionStore from '../../../../zustand/courseTransactionStore';
import { formatRupiah } from '../../../../utils/formatRupiah';

export default function CourseTransaction() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Transaksi Kursus', path: location.pathname }];

  const {
    transactions,
    fetchTransactions,
    pagination,
    sortBy,
    sortOrder,
    perPage,
    loading,
    error,
  } = useCourseTransactionStore();

  // State for filter/search
  const [filterValues, setFilterValues] = useState({ user: '' });
  const [searchInput, setSearchInput] = useState('');

  // Filter config: only search for user name
  const filters = [
    {
      key: 'user',
      label: 'Cari Nama Pengguna',
      type: 'search',
      withButton: true,
      placeholder: 'Masukkan nama pengguna',
    },
  ];

  // Fetch transactions when filter/search changes
  useEffect(() => {
    fetchTransactions({
      sortBy,
      sortOrder,
      perPage,
      page: pagination.currentPage,
      user: filterValues.user,
    });
  }, [sortBy, sortOrder, perPage, pagination.currentPage, filterValues.user]);

  const handleSortChange = (column, order) => {
    fetchTransactions({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      user: filterValues.user,
    });
  };

  const handlePageChange = (page) => {
    fetchTransactions({
      sortBy,
      sortOrder,
      perPage,
      page,
      user: filterValues.user,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchTransactions({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      user: filterValues.user,
    });
  };

  // Handle filter change from TableFilter
  const handleFilterChange = (values) => {
    setFilterValues(values);
  };

  const columns = [
    {
      Header: 'Pengguna',
      accessor: 'user',
      width: '20%',
      disableSort: true,
    },
    {
      Header: 'Kursus',
      accessor: 'courses',
      width: '30%',
      disableSort: true,
      Cell: ({ value }) =>
        Array.isArray(value) ? (
          <p className="list-disc pl-4">
            {value.map((course, idx) => (
              <li key={idx}>{course}</li>
            ))}
          </p>
        ) : (
          '-'
        ),
    },
    {
      Header: 'Tanggal Transaksi',
      accessor: 'created_at',
      width: '15%',
      Cell: ({ value }) => (value ? value : '-'),
      disableSort: true,
    },
    {
      Header: 'Status',
      accessor: 'payment_status',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => {
        let label = '';
        let colorClass = '';
        switch (value) {
          case 'paid':
            label = 'Lunas';
            colorClass = 'bg-green-200 text-green-800';
            break;
          case 'pending':
            label = 'Menunggu';
            colorClass = 'bg-yellow-200 text-yellow-800';
            break;
          default:
            label = value;
            colorClass = 'bg-gray-100 text-gray-500';
        }
        return (
          <div className="w-full flex justify-center">
            <div className={`inline-block px-2 py-1 rounded ${colorClass}`}>{label}</div>
          </div>
        );
      },
    },
    {
      Header: 'Harga',
      accessor: 'price',
      width: '20%',
      disableSort: true,
      Cell: ({ value }) => (value ? formatRupiah(value) : '-'),
    },
  ];

  return (
    <AdminTemplate activeNav="transaksi kursus" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Daftar Transaksi Kursus</h2>
        {/* TableFilter for searching user name */}
        <TableFilter
          filters={filters}
          values={filterValues}
          onFilterChange={handleFilterChange}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <div>
          {error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : (
            <ReactTable
              columns={columns}
              data={transactions}
              numbering={true}
              onSortChange={handleSortChange}
              pagination={{
                currentPage: pagination.currentPage,
                lastPage: pagination.lastPage,
                perPage,
              }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              loading={loading}
            />
          )}
        </div>
      </div>
    </AdminTemplate>
  );
}
