import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/icon';

export default function SelectOption({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    if (!disabled) {
      onChange({ target: { name, value: optionValue } });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      onChange({ target: { name, value: '' } });
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className={`mb-2 text-sm font-medium text-gray-700`}>
        {label}
      </label>
      <div className="relative">
        <div
          className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
            disabled
              ? 'bg-gray-100 text-black cursor-not-allowed'
              : 'focus:ring-primary-500 bg-white cursor-pointer'
          } w-full ${value ? 'text-black' : 'text-gray-400'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {value ? (
            options.find((option) => option.value === value)?.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1 py-1 rounded"
            tabIndex={-1}
            aria-label="Hapus pilihan"
          >
            <Icon type="x-mark" className="size-5" />
          </button>
        )}
        {isOpen && !disabled && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-y-auto select-dropdown">
            {options.length === 0 ? (
              <li className="px-3 py-2 text-error-400 cursor-not-allowed select-none">
                Belum ada data
              </li>
            ) : (
              options.map((option) => (
                <li
                  key={option.value}
                  className="px-3 py-2 hover:bg-primary-500 hover:text-white cursor-pointer"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

SelectOption.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectOption.defaultProps = {
  value: '',
  placeholder: 'Select an option',
  disabled: false,
};
