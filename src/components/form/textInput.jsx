import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/icon';

function formatRupiah(value) {
  if (value === null || value === undefined) return '';
  const strValue = String(value); // pastikan string
  // Remove non-digit
  const numberString = strValue.replace(/\D/g, '');
  if (!numberString) return '';
  // Format with dot
  const formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp. ${formatted}`;
}

export default function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  isPrice,
  min,
  required,
}) {
  // Handler untuk input harga
  const handleInputChange = (e) => {
    let val = e.target.value;
    if (isPrice) {
      // Remove non-digit
      const numberString = val.replace(/\D/g, '');
      // Kirim value angka ke parent
      onChange({ target: { name, value: numberString } });
    } else {
      onChange(e);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      onChange({ target: { name, value: '' } });
    }
  };

  // Untuk input harga, tampilkan value terformat
  const displayValue = isPrice ? formatRupiah(value) : value;

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
      <div className="relative flex">
        {isPrice && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none z-10">
            Rp
          </span>
        )}
        <input
          type={isPrice ? 'text' : type}
          type={isPrice ? 'text' : type}
          id={name}
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          required={required}
          inputMode={isPrice ? 'numeric' : undefined}
          autoComplete="off"
          className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 w-full pr-10 ${
            isPrice ? 'pl-10' : ''
          } ${
            disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-primary-500'
          }`}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1 py-1 rounded z-10"
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
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // <-- fix here
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isPrice: PropTypes.bool,
  min: PropTypes.number,
  required: PropTypes.bool,
};

TextInput.defaultProps = {
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  isPrice: false,
  min: undefined,
  required: false,
};
