import React from 'react';
import { useTable, usePagination } from 'react-table';
import Icon from '../icons/icon';

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
  const { getTableProps, getTableBodyProps, headerGroups } = useTable(
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
      newOrder = 'asc';
    }
    onSortChange(columnId, newOrder);
  };

  return (
    <div className="overflow-x-auto">
      {/* Table for larger screens */}
      <table
        {...getTableProps()}
        className="table-auto w-full border-collapse border border-gray-300 hidden sm:table"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {numbering && (
                <th className="border border-gray-300 px-2 py-2 text-sm w-12 text-center">No</th>
              )}
              {headerGroup.headers.map((column) => {
                const columnId = column.id || column.accessor;
                const isSorted = sortBy === columnId;
                const isDesc = sortOrder === 'desc';
                const isSortable = !column.disableSort;
                const widthStyle = column.width ? { width: column.width } : {};

                return (
                  <th
                    key={columnId}
                    onClick={() => {
                      if (isSortable) toggleSort(columnId);
                    }}
                    style={widthStyle}
                    className={`border border-gray-300 px-4 py-2 text-center ${
                      isSortable ? 'cursor-pointer select-none' : ''
                    }`}
                  >
                    {column.render('Header')}
                    {isSortable && (
                      <span className="ml-1">
                        {isSorted ? (
                          isDesc ? (
                            <Icon type="sort-down" className="size-[1.3rem] inline-block" />
                          ) : (
                            <Icon type="sort-up" className="size-[1.3rem] inline-block" />
                          )
                        ) : (
                          <Icon type="sort" className="size-[1.3rem] inline-block" />
                        )}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {data.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-gray-100">
              {numbering && (
                <td className="border border-gray-300 px-4 py-2 text-sm w-12 text-center">
                  {(pagination.currentPage - 1) * pagination.perPage + i + 1}
                </td>
              )}
              {columns.map((col, ci) => {
                const value =
                  typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];

                const widthStyle = col.width ? { width: col.width } : {};

                return (
                  <td key={ci} style={widthStyle} className="border border-gray-300 px-4 py-2">
                    {col.Cell ? col.Cell({ value }) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Responsive table for smaller screens */}
      <div className="block sm:hidden">
        {data.map((row, i) => (
          <div
            key={row.id || i}
            className="border border-gray-300 rounded-lg mb-4 p-4 bg-white shadow"
          >
            {numbering && (
              <div className="mb-2">
                <strong>No:</strong> {(pagination.currentPage - 1) * pagination.perPage + i + 1}
              </div>
            )}
            {columns.map((col, ci) => {
              const value =
                typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor];
              return (
                <div key={ci} className="mb-2">
                  <strong>{col.Header}:</strong> {col.Cell ? col.Cell({ value }) : value}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pagination mt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-center">
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
        <div className="flex justify-center sm:justify-end">
          <select
            value={pagination.perPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
