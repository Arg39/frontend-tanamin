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
      width: '30%',
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
      Header: 'Tanggal bergabung',
      accessor: 'created_at',
      width: '20%',
      Cell: ({ value }) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(value));
      },
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      Cell: ({ value }) => (
        <div className="w-fit flex flex-col gap-4 justify-center items-start text-md">
          <button
            className="p-1 px-4 rounded-md bg-primary-500 hover:bg-primary-700"
            onClick={() => {
              console.log('View instructor with ID:', value);
            }}
          >
            view
          </button>
          <button
            className="p-1 px-4 rounded-md bg-secondary-800 hover:bg-secondary-700 text-white-100"
            onClick={() => {
              console.log('Edit instructor with ID:', value);
            }}
          >
            Edit
          </button>
          <button
            className="p-1 px-4 rounded-md bg-red-500 hover:bg-red-700 text-white-100"
            onClick={() => {
              console.log('Delete instructor with ID:', value);
            }}
          >
            delete
          </button>
        </div>
      ),
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
