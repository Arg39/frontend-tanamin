import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/icon';

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
            w-6 h-6 flex items-center justify-center
            ${checked ? 'bg-white border-primary-700' : 'bg-white border-primary-700'}
            ${disabled ? 'cursor-not-allowed' : ''}
            ${className || ''}
          `}
          role="checkbox"
          tabIndex={0}
        >
          {checked && (
            <span className="absolute inset-0 flex items-center justify-center text-primary-700">
              <Icon type="check" className="w-8 h-8 text-primary-700" strokeWidth={2.2} />
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
            w-12 h-7 flex items-center
            ${checked ? 'bg-primary-700' : 'bg-gray-300'}
            ${disabled ? 'cursor-not-allowed' : ''}
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
