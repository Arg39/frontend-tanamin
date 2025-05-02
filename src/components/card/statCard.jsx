import React from 'react';
import Icon from '../icons/icon';

const formatNumber = (num) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace('.0', '') + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace('.0', '') + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace('.0', '') + 'K';
  }
  return num.toString();
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white-100 rounded-lg">
      <div className="flex justify-center items-center mb-2 bg-primary-800 rounded-full w-24 h-24">
        <Icon type={icon} className="size-12" color="white" />
      </div>
      <p className="text-center font-semibold">{label}</p>
      <p className="text-center text-3xl font-bold">{formatNumber(value)}</p>
    </div>
  );
};

export default StatCard;
