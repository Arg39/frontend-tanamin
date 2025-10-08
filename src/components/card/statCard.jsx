import React from 'react';
import Icon from '../icons/icon';

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace('.0', '') + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace('.0', '') + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace('.0', '') + 'K';
  }
  return num.toString();
};

const StatCard = ({ icon, label, value, className = '' }) => {
  return (
    <div
      className={`flex flex-row lg:flex-col gap-4 items-center justify-center p-4 bg-white rounded-lg shadow-md h-full ${className}`}
      style={{ minHeight: 120 }}
    >
      <div className="flex justify-center items-center bg-primary-800 rounded-full w-14 h-14 md:w-24 md:h-24">
        <Icon type={icon} className="size-6 md:size-10" color="white" />
      </div>
      <div className="flex flex-col text-start lg:text-center">
        <p className="text-sm md:text-base font-semibold">{label}</p>
        <p className="text-2xl md:text-3xl font-bold">{formatNumber(value)}</p>
      </div>
    </div>
  );
};

export default StatCard;
