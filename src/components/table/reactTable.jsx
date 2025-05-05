import React from 'react';

export default function ReactTable({
  columns,
  data,
  numbering,
  pagination,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}) {
  const { currentPage, lastPage, total } = pagination;

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {numbering && <th className="border border-gray-300 px-4 py-2 text-left">No</th>}
            {columns.map((column) => (
              <th
                key={column.Header}
                onClick={() => onSortChange(column.accessor)}
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {numbering && (
                <td className="border border-gray-300 px-4 py-2">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
              )}
              {columns.map((column) => (
                <td key={column.Header} className="border border-gray-300 px-4 py-2">
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination mt-4 flex justify-between items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {lastPage} (Total: {total})
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
        <select
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
