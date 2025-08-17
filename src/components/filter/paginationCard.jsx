import React from 'react';
import Icon from '../icons/icon';

// Generate page numbers for pagination with ellipsis
function getPageNumbers(current, total) {
  if (total <= 4) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  if (current <= 2) {
    pages.push(1, 2, 3, '...', total);
  } else if (current >= total - 1) {
    pages.push(1, '...', total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}

export default function PaginationCard({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex w-full bg-white p-2 px-4 rounded-full justify-between items-center border-2 border-primary-700">
        <button
          className={`flex items-center text-primary-700 gap-1 border-primary-700 hover:underline font-medium ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <Icon type={'alt-arrow-left'} />
          Sebelumnya
        </button>
        <div className="flex items-center gap-2">
          {pages.map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center rounded-full font-medium text-primary-700"
              >
                ...
              </span>
            ) : (
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
            )
          )}
        </div>
        <button
          className={`flex items-center text-primary-700 gap-1 border-primary-700 hover:underline font-medium ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Selanjutnya
          <Icon type={'alt-arrow-right'} />
        </button>
      </div>

      {/* Mobile Version */}
      <div className="flex md:hidden w-full bg-white p-2 px-4 rounded-lg justify-between items-center border border-primary-700 text-sm">
        <button
          className={`flex items-center text-primary-700 gap-1 font-medium ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <Icon type={'alt-arrow-left'} />
          Sebelumnya
        </button>

        {/* Compact page info */}
        <span className="text-primary-700 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <button
          className={`flex items-center text-primary-700 gap-1 font-medium ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Selanjutnya
          <Icon type={'alt-arrow-right'} />
        </button>
      </div>
    </>
  );
}
