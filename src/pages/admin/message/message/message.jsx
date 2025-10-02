import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import ReactTable from '../../../../components/table/reactTable';
import TableFilter from '../../../../components/table/tableFilter';
import useMessageStore from '../../../../zustand/public/contact/messageStore';

export default function AdminMessage() {
  const navigate = useNavigate();
  const { messages, fetchMessages, pagination, sortBy, sortOrder, perPage, loading, error } =
    useMessageStore();

  // State for filter
  const [filterValues, setFilterValues] = useState({
    name: '',
    subject: '',
    created_at: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  // Fetch data on mount & when filter/sort/pagination changes
  useEffect(() => {
    fetchMessages({
      sortBy,
      sortOrder,
      perPage,
      page: pagination.currentPage,
      name: filterValues.name,
      subject: filterValues.subject,
      dateStart: filterValues.created_at.start,
      dateEnd: filterValues.created_at.end,
    });
    // eslint-disable-next-line
  }, [sortBy, sortOrder, perPage, pagination.currentPage, filterValues]);

  // Filter config
  const filters = [
    {
      key: 'created_at',
      label: 'Tanggal Kirim',
      type: 'dateRange',
      placeholder: 'Pilih rentang tanggal',
    },
  ];

  // Table columns (match backend fields)
  const columns = [
    {
      Header: 'Nama',
      accessor: 'name',
      width: '18%',
      Cell: ({ value }) => <span>{value}</span>,
      disableSort: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
      width: '18%',
      disableSort: true,
    },
    {
      Header: 'Subjek',
      accessor: 'subject',
      width: '18%',
      disableSort: true,
    },
    {
      Header: 'Pesan',
      accessor: 'message',
      width: '30%',
      Cell: ({ value }) => <span>{value}</span>,
      disableSort: true,
    },
    {
      Header: 'Tanggal Kirim',
      accessor: 'created_at',
      width: '10%',
      Cell: ({ value }) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(value));
      },
      disableSort: true,
    },
  ];

  // Filter handler
  const handleFilterChange = (values) => {
    setFilterValues(values);
  };

  // Sort handler
  const handleSortChange = (column, order) => {
    fetchMessages({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      name: filterValues.name,
      subject: filterValues.subject,
      dateStart: filterValues.created_at.start,
      dateEnd: filterValues.created_at.end,
    });
  };

  // Pagination handler
  const handlePageChange = (page) => {
    fetchMessages({
      sortBy,
      sortOrder,
      perPage,
      page,
      name: filterValues.name,
      subject: filterValues.subject,
      dateStart: filterValues.created_at.start,
      dateEnd: filterValues.created_at.end,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchMessages({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      name: filterValues.name,
      subject: filterValues.subject,
      dateStart: filterValues.created_at.start,
      dateEnd: filterValues.created_at.end,
    });
  };

  // Breadcrumb
  const breadcrumbItems = [{ label: 'Pesan', path: '/admin/message' }];

  return (
    <AdminTemplate activeNav="pesan" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Pesan</h2>
        </div>
        <TableFilter
          filters={filters}
          values={filterValues}
          onFilterChange={handleFilterChange}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        {error && <p className="text-red-500">{error}</p>}
        <ReactTable
          columns={columns}
          data={messages}
          numbering={true}
          onSortChange={handleSortChange}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          loading={loading}
        />
      </div>
    </AdminTemplate>
  );
}
