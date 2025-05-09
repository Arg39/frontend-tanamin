import React, { useEffect } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useInstructorStore from '../../../zustand/instructorStore';
import ReactTable from '../../../components/table/reactTable';

export default function Instructor() {
  const { instructors, fetchInstructors, pagination, sortBy, sortOrder, perPage, error } =
    useInstructorStore();

  useEffect(() => {
    // Fetch instructors with default sorting by first_name in ascending order
    fetchInstructors({ sortBy: 'first_name', sortOrder: 'asc' });
  }, [fetchInstructors]);

  const handleSortChange = (column, order) => {
    fetchInstructors({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
    });
  };

  const handlePageChange = (page) => {
    fetchInstructors({ sortBy, sortOrder, perPage, page });
  };

  const handlePageSizeChange = (size) => {
    fetchInstructors({ sortBy, sortOrder, perPage: size, page: 1 });
  };

  const columns = [
    {
      Header: 'Nama',
      accessor: (row) => `${row.first_name} ${row.last_name}`,
      width: '40%',
      Cell: ({ value }) => <span>{value}</span>,
    },
    {
      Header: 'Email',
      accessor: 'email',
      width: '25%',
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: '15%',
      Cell: ({ value }) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: 'Tanggal Dibuat',
      accessor: 'created_at',
      width: '20%',
      Cell: ({ value }) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(value));
      },
    },
  ];

  return (
    <AdminTemplate activeNav="instruktur">
      <div className="bg-white-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Daftar Instruktur</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ReactTable
          columns={columns}
          data={instructors}
          numbering={true}
          onSortChange={handleSortChange}
          pagination={{ ...pagination, perPage }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>
    </AdminTemplate>
  );
}
