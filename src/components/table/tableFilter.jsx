import React, { useState, useRef } from 'react';
import Icon from '../icons/icon';

export default function TableFilter({
  filters,
  values,
  onFilterChange,
  searchInput,
  setSearchInput,
}) {
  const [showDateRange, setShowDateRange] = useState(false);
  const dateRangeRef = useRef(null);

  const handleChange = (key, value) => {
    onFilterChange({ ...values, [key]: value });
  };

  // Untuk klik di luar date range picker
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
        setShowDateRange(false);
      }
    }
    if (showDateRange) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateRange]);

  // Fungsi reset
  const handleReset = () => {
    const resetValues = {};
    filters.forEach((filter) => {
      if (filter.type === 'dateRange') {
        resetValues[filter.key] = { start: '', end: '' };
      } else {
        resetValues[filter.key] = '';
      }
    });
    onFilterChange(resetValues);
    if (setSearchInput) setSearchInput('');
  };

  return (
    <div
      className="
        flex flex-col gap-y-3
        sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-0
        md:items-end
        mb-4
      "
    >
      {filters.map((filter) => {
        if (filter.type === 'search' && filter.withButton) {
          return (
            <div key={filter.key} className="flex flex-col w-full sm:w-[220px] md:w-[240px]">
              <label className="mb-1 text-sm">{filter.label}</label>
              <form
                className="relative flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChange(filter.key, searchInput);
                }}
              >
                <input
                  type="text"
                  value={searchInput || ''}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={filter.placeholder || ''}
                  className="border px-2 py-1 rounded pr-8 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent hover:bg-transparent focus:outline-none"
                  title="Cari"
                  tabIndex={-1}
                >
                  <Icon type="magnifying-glass" className="size-[1.2rem] text-gray-500" />
                </button>
              </form>
            </div>
          );
        }
        if (filter.type === 'search') {
          return (
            <div key={filter.key} className="flex flex-col w-full sm:w-[220px] md:w-[240px]">
              <label className="mb-1 text-sm">{filter.label}</label>
              <input
                type="text"
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                placeholder={filter.placeholder || ''}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
          );
        }
        if (filter.type === 'select') {
          return (
            <div key={filter.key} className="flex flex-col w-full sm:w-[180px] md:w-[200px]">
              <label className="mb-1 text-sm">{filter.label}</label>
              <select
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="">{filter.placeholder || 'Semua'}</option>
                {filter.options &&
                  filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>
          );
        }
        if (filter.type === 'dateRange') {
          // Gabungkan jadi 1 input, saat klik muncul 2 date picker
          const start = values[filter.key]?.start || '';
          const end = values[filter.key]?.end || '';
          let displayValue = '';
          if (start && end) {
            displayValue = `${start} s/d ${end}`;
          } else if (start) {
            displayValue = `${start} s/d -`;
          } else if (end) {
            displayValue = `- s/d ${end}`;
          } else {
            displayValue = '';
          }
          return (
            <div
              key={filter.key}
              className="flex flex-col w-full sm:w-[240px] md:w-[260px] relative"
            >
              <label className="mb-1 text-sm">{filter.label}</label>
              <div>
                <button
                  type="button"
                  className="border px-2 py-1 rounded w-full text-left bg-white"
                  onClick={() => setShowDateRange((prev) => !prev)}
                >
                  {displayValue || filter.placeholder || 'Pilih rentang tanggal'}
                </button>
                {showDateRange && (
                  <div
                    ref={dateRangeRef}
                    className="absolute z-20 bg-white border rounded shadow-md p-4 mt-2 w-[260px] left-0"
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="text-xs mb-1 block">Tanggal Mulai</label>
                        <input
                          type="date"
                          value={start}
                          onChange={(e) =>
                            handleChange(filter.key, {
                              ...values[filter.key],
                              start: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block">Tanggal Akhir</label>
                        <input
                          type="date"
                          value={end}
                          onChange={(e) =>
                            handleChange(filter.key, {
                              ...values[filter.key],
                              end: e.target.value,
                            })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                          onClick={() => {
                            handleChange(filter.key, { start: '', end: '' });
                            setShowDateRange(false);
                          }}
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 rounded bg-primary-600 hover:bg-primary-700 text-white text-sm"
                          onClick={() => setShowDateRange(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
      {/* Tombol Reset */}
      <div className="w-full sm:w-auto flex">
        <button
          type="button"
          onClick={handleReset}
          className="
            px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 text-sm font-medium
            w-full sm:w-auto
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
}
