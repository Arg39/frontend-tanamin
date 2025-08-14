import React from 'react';
import Icon from '../icons/icon';

// Show all page numbers based on backend pagination
function getPageNumbers(current, total) {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }
  return pages;
}

export default function PaginationCard({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="w-full bg-white p-2 px-4 rounded-full flex justify-between items-center border-2 border-primary-700">
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary-700 text-white border-primary-700 font-medium ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <Icon type={'round-arrow-left'} className="size-[14px]" />
      </button>
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center rounded-full font-medium ${
              page === currentPage
                ? 'bg-primary-700 text-white'
                : 'bg-white text-primary-700 border border-primary-700'
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary-700 text-white border-primary-700 font-medium ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <Icon type={'round-arrow-right'} className="size-[14px]" />
      </button>
    </div>
  );
}
