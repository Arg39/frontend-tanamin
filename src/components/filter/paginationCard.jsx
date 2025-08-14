import React from 'react';
import Icon from '../icons/icon';

function getPageNumbers(current, total) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }
  return pages;
}

export default function PaginationCard({
  currentPage = 1,
  totalPages = 99,
  onPageChange = () => {},
}) {
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
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={idx} className="px-2">
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
