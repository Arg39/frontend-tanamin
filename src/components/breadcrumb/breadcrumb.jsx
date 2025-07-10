import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Breadcrumb({ items = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to check window width
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Collapse logic for mobile: show first, ellipsis, last if more than 3 items
  let displayItems = items;
  let showEllipsis = false;
  if (isMobile && items.length > 3) {
    displayItems = [items[0], items[items.length - 1]];
    showEllipsis = true;
  }

  return (
    <nav className="mb-4 text-secondary-500 font-normal text-base" aria-label="breadcrumb">
      <ol className="flex flex-wrap">
        {displayItems.map((item, index) => {
          // Calculate the real index in the original items array
          let realIndex = index;
          if (isMobile && items.length > 3) {
            realIndex = index === 0 ? 0 : items.length - 1;
          }
          return (
            <li key={realIndex} className="flex items-center">
              {realIndex !== 0 && <span className="px-2">{'>'}</span>}
              {realIndex !== items.length - 1 ? (
                <Link to={item.path} className="text-primary-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-tertiary-500">{item.label}</span>
              )}
              {/* Insert ellipsis after first item on mobile */}
              {isMobile && showEllipsis && index === 0 && <span className="px-2">...</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
