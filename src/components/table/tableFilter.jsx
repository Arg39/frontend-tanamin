import React from 'react';

export default function TableFilter({ filters, values, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...values, [key]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      {filters.map((filter) => {
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
