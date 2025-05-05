import React from 'react';
import { useTable, usePagination } from 'react-table';

export default function ReactTable({
  columns,
  data,
  numbering,
  onSortChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
}) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  const toggleSort = (columnId) => {
    if (!onSortChange) return;

    let newOrder = 'asc';
    if (sortBy === columnId && sortOrder === 'asc') {
      newOrder = 'desc';
    } else if (sortBy === columnId && sortOrder === 'desc') {
      newOrder = 'asc'; // Toggle back to asc
    }
    onSortChange(columnId, newOrder);
  };

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border border-gray-300"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
              {numbering && <th className="border border-gray-300 px-4 py-2 text-left">No</th>}
              {headerGroup.headers.map((column) => {
                const columnId = column.id || column.accessor; // Ensure correct id
                const isSorted = sortBy === columnId;
                const isDesc = sortOrder === 'desc';

                return (
                  <th
                    key={columnId}
                    onClick={() => toggleSort(columnId)}
                    className="border border-gray-300 px-4 py-2 text-left cursor-pointer select-none"
                  >
                    {column.render('Header')}
                    <span className="ml-1">{isSorted ? (isDesc ? ' 🔽' : ' 🔼') : ' ↕️'}</span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {data.map((row, i) => {
            return (
              <tr key={row.id || i} className="hover:bg-gray-100">
                {numbering && (
                  <td className="border border-gray-300 px-4 py-2">
                    {(pagination.currentPage - 1) * pagination.perPage + i + 1}
                  </td>
                )}
                {columns.map((col, ci) => {
                  const accessor =
                    typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
                  return (
                    <td key={ci} className="border border-gray-300 px-4 py-2">
                      {accessor}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination mt-4 flex justify-between items-center">
        <div className="space-x-10">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page{' '}
            <strong>
              {pagination.currentPage} of {pagination.lastPage}
            </strong>
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <select
          value={pagination.perPage}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="ml-4 px-2 py-1 border border-gray-300 rounded"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
