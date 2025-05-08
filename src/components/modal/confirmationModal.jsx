import React, { useRef, useEffect } from 'react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  closeModal,
  variant,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-900 bg-opacity-65">
      <div ref={modalRef} className="bg-white-100 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-black-700 rounded hover:bg-gray-400"
          >
            Tidak
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white-100 rounded ${
              variant === 'primary'
                ? 'bg-green-600 hover:bg-primary-900'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
}
