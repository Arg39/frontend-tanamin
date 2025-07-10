import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../icons/icon';

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export default function PasswordInputGenerator({
  label,
  name,
  value,
  onChange,
  placeholder,
  showGenerate = true,
}) {
  const [show, setShow] = useState(false);

  const handleGenerate = () => {
    const newPassword = generatePassword();
    onChange({ target: { name, value: newPassword } });
  };

  const handleToggleShow = () => setShow((prev) => !prev);

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
          type={show ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full pr-24"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-1 py-1 rounded"
            tabIndex={-1}
            aria-label="Hapus password"
          >
            <Icon type="x-mark" className="size-5" />
          </button>
        ) : (
          showGenerate && (
            <button
              type="button"
              onClick={handleGenerate}
              className="absolute right-14 top-1/2 -translate-y-1/2 bg-primary-500 text-white px-2 py-1 rounded text-xs hover:bg-primary-600"
              tabIndex={-1}
            >
              Generate
            </button>
          )
        )}
        <button
          type="button"
          onClick={handleToggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 px-2 py-1 rounded text-xs flex items-center"
          tabIndex={-1}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <Icon type={show ? 'eye-off' : 'eye'} className="size-5" />
        </button>
      </div>
    </div>
  );
}

PasswordInputGenerator.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showGenerate: PropTypes.bool,
};
