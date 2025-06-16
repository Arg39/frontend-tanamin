import React, { useEffect, useRef, useState } from 'react';
import Icon from '../icons/icon';

export default function LessonDropdown({ isMobile, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [width, setWidth] = useState(160);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = menuRef.current?.getBoundingClientRect();
      const dropdownWidth = dropdownRect?.width || 160;
      setWidth(dropdownWidth);

      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - dropdownWidth,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="p-2 bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white-100 flex items-center justify-center"
        onClick={() => setOpen(!open)}
        title="Options"
      >
        <Icon type="more" className={`size-4 ${isMobile ? 'w-4 h-4' : ''}`} />
      </button>
      {open && (
        <ul
          ref={menuRef}
          className="fixed z-[9999] w-40 bg-white-100 border rounded shadow-lg text-xs sm:text-sm"
          style={{ top: coords.top, left: coords.left }}
        >
          <li>
            <button
              className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              style={{ fontSize: isMobile ? 16 : undefined }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit?.();
              }}
            >
              Edit
            </button>
          </li>
          <li>
            <button
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500"
              style={{ fontSize: isMobile ? 16 : undefined }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete?.();
              }}
            >
              Hapus
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
