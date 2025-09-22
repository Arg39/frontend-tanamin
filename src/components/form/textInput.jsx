import PropTypes from 'prop-types';
import Icon from '../icons/icon';

// Utility function for transformation
function toUpperDash(str) {
  if (typeof str !== 'string') return str;
  return str.toUpperCase().replace(/\s+/g, '-');
}

function formatRupiah(value) {
  if (value === null || value === undefined) return '';
  const strValue = String(value);
  const numberString = strValue.replace(/\D/g, '');
  if (!numberString) return '';
  const formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}`;
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
  max,
  required,
  textarea,
  rows,
  rightButton,
  transformToUpperDash, // NEW PROP
}) {
  const handleInputChange = (e) => {
    let val = e.target.value;

    // Apply transformation if enabled
    if (transformToUpperDash) {
      val = toUpperDash(val);
      // Simulate event for controlled input
      onChange({ target: { name, value: val } });
      return;
    }

    // For price input
    if (isPrice) {
      const numberString = val.replace(/\D/g, '');
      const numValue = Number(numberString);

      // Check min and max if provided
      if (
        (min !== undefined && numberString !== '' && numValue < min) ||
        (max !== undefined && numberString !== '' && numValue > max)
      ) {
        return; // Prevent input if out of bounds
      }

      onChange({ target: { name, value: numberString } });
    }
    // For number input
    else if (type === 'number') {
      if (val === '' || /^[0-9]+$/.test(val)) {
        const numValue = Number(val);

        // Check min and max if provided
        if (
          (min !== undefined && val !== '' && numValue < min) ||
          (max !== undefined && val !== '' && numValue > max)
        ) {
          return; // Prevent input if out of bounds
        }

        onChange({ target: { name, value: val } });
      }
    }
    // For other types
    else {
      onChange(e);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      onChange({ target: { name, value: '' } });
    }
  };

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
        {textarea ? (
          <>
            <textarea
              id={name}
              name={name}
              value={displayValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              rows={rows}
              className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 w-full pr-10 ${
                disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-primary-500'
              }`}
            />
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 px-1 py-1 rounded z-10"
                tabIndex={-1}
                aria-label="Hapus input"
              >
                <Icon type="x-mark" className="size-5" />
              </button>
            )}
            {rightButton && <div className="absolute right-10 top-2">{rightButton}</div>}
          </>
        ) : (
          <>
            {isPrice && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none z-10">
                Rp
              </span>
            )}
            <input
              type={isPrice ? 'text' : type}
              id={name}
              name={name}
              value={displayValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              min={type === 'number' ? min : undefined}
              max={type === 'number' ? max : undefined}
              required={required}
              inputMode={isPrice ? 'numeric' : type === 'number' ? 'numeric' : undefined}
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
            {rightButton && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">{rightButton}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isPrice: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
  rows: PropTypes.number,
  rightButton: PropTypes.node,
  transformToUpperDash: PropTypes.bool, // NEW PROP
};

TextInput.defaultProps = {
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  isPrice: false,
  min: undefined,
  max: undefined,
  required: false,
  textarea: false,
  rows: 4,
  rightButton: null,
  transformToUpperDash: false, // NEW PROP
};
