import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function ImagePicker({ label, name, onChange, preview }) {
  const [localPreview, setLocalPreview] = useState(preview || null);

  // Update localPreview whenever preview changes
  useEffect(() => {
    setLocalPreview(
      preview ? `${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${preview}` : null
    );
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
      onChange(e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
      const event = { target: { name, files: [file] } };
      onChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className="border border-gray-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center relative h-48"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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
  preview: PropTypes.string,
};
