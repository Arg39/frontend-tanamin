import React from 'react';
import PropTypes from 'prop-types';

export default function Checkbox({
  label,
  name,
  checked,
  onChange,
  disabled,
  required,
  box,
  className,
}) {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange({ target: { name, checked: !checked } });
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className={`mb-2 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
        </label>
      )}
      {box ? (
        <button
          type="button"
          id={name}
          name={name}
          aria-checked={checked}
          disabled={disabled}
          required={required}
          onClick={handleToggle}
          className={`relative rounded border transition-colors duration-200 focus:outline-none
            ${checked ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className || ''}
          `}
          role="checkbox"
          tabIndex={0}
        >
          {checked && (
            <span className="absolute inset-0 flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 10l4 4 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          id={name}
          name={name}
          aria-checked={checked}
          disabled={disabled}
          required={required}
          onClick={handleToggle}
          className={`relative rounded-full transition-colors duration-200 focus:outline-none
            ${checked ? 'bg-primary-500' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className || ''}
          `}
          role="switch"
          tabIndex={0}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      )}
    </div>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  box: PropTypes.bool,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  label: '',
  disabled: false,
  required: false,
  box: false,
  className: '',
};
