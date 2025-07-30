import React from 'react';
import PropTypes from 'prop-types';

export default function Checkbox({ label, name, checked, onChange, disabled, required }) {
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
      <button
        type="button"
        id={name}
        name={name}
        aria-checked={checked}
        disabled={disabled}
        required={required}
        onClick={handleToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-primary-500' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        tabIndex={0}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
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
};

Checkbox.defaultProps = {
  label: '',
  disabled: false,
  required: false,
};
