import React from 'react';
import Icon from '../icons/icon';

export default function TableFilter({
  filters,
  values,
  onFilterChange,
  searchInput,
  setSearchInput,
}) {
  const handleChange = (key, value) => {
    onFilterChange({ ...values, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      {filters.map((filter) => {
        if (filter.type === 'search' && filter.withButton) {
          return (
            <div key={filter.key} className="flex flex-col">
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
                  className="border px-2 py-1 rounded pr-8"
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
            <div key={filter.key} className="flex flex-col">
              <label className="mb-1 text-sm">{filter.label}</label>
              <input
                type="text"
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                placeholder={filter.placeholder || ''}
                className="border px-2 py-1 rounded"
              />
            </div>
          );
        }
        if (filter.type === 'select') {
          return (
            <div key={filter.key} className="flex flex-col">
              <label className="mb-1 text-sm">{filter.label}</label>
              <select
                value={values[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                className="border px-2 py-1 rounded"
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
          return (
            <div key={filter.key} className="flex flex-col">
              <label className="mb-1 text-sm">{filter.label}</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={values[filter.key]?.start || ''}
                  onChange={(e) =>
                    handleChange(filter.key, {
                      ...values[filter.key],
                      start: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded"
                />
                <span className="self-center">-</span>
                <input
                  type="date"
                  value={values[filter.key]?.end || ''}
                  onChange={(e) =>
                    handleChange(filter.key, {
                      ...values[filter.key],
                      end: e.target.value,
                    })
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
