import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ImagePicker({ label, name, onChange, preview }) {
  const [localPreview, setLocalPreview] = useState(null);

  useEffect(() => {
    if (!preview) {
      setLocalPreview(null);
    } else if (typeof preview === 'string') {
      // Jika preview sudah berupa URL lokal (blob: atau data:), pakai langsung
      if (
        preview.startsWith('blob:') ||
        preview.startsWith('data:') ||
        preview.startsWith('http')
      ) {
        setLocalPreview(preview);
      } else {
        // Anggap ini nama file dari backend
        setLocalPreview(`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${preview}`);
      }
    } else if (preview instanceof File) {
      setLocalPreview(URL.createObjectURL(preview));
      // Clean up object URL jika file berubah
      return () => {
        URL.revokeObjectURL(localPreview);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="border border-gray-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center relative h-48">
        {localPreview ? (
          <img src={localPreview} alt="Preview" className="max-h-full object-contain" />
        ) : (
          <span className="text-gray-500 text-center">
            Drag and drop an image here or click to select
          </span>
        )}
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

ImagePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File),
    PropTypes.oneOf([null]),
  ]),
};
