import React from 'react';
import Icon from '../icons/icon';

export default function ResponsiveList({
  data = [],
  columns = [],
  pagination = { currentPage: 1, lastPage: 1, perPage: 5 },
  onPageChange,
  onPageSizeChange,
  renderItem,
}) {
  return (
    <div>
      {/* Desktop/List View */}
      <div className="hidden sm:block">
        <div className="flex flex-col gap-2">
          {data.map((item, idx) => (
            <>{renderItem(item, idx)}</>
          ))}
        </div>
      </div>
      {/* Mobile/Card View */}
      <div className="block sm:hidden">
        <div className="flex flex-col gap-2">
          {data.map((item, idx) => (
            <>{renderItem(item, idx)}</>
          ))}
        </div>
      </div>
      {/* Pagination */}
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
            {[5, 10, 20, 30, 40, 50].map((size) => (
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
