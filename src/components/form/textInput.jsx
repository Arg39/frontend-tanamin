import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/icon';

export default function TextInput({ label, name, value, onChange, placeholder }) {
  const handleClear = () => {
    onChange({ target: { name, value: '' } });
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative flex">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full pr-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1 py-1 rounded"
            tabIndex={-1}
            aria-label="Hapus input"
          >
            <Icon type="x-mark" className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
