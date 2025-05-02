import React from 'react';
import AdminTemplate from '../../template/templateAdmin';
import StatCard from '../../components/card/statCard';
import dashboardStore from '../../zustand/temporaryDummyData/dashboardStore';
import { Link } from 'react-router-dom';
import Icon from '../../components/icons/icon';

export default function DashboardAdmin() {
  const { data } = dashboardStore();

  const stats = [
    { key: 'course', label: 'Course', icon: 'book' },
    { key: 'user', label: 'User', icon: 'user-filled' },
    { key: 'message', label: 'Message', icon: 'message-filled' },
  ];

  const chunkedStats = [];
  for (let i = 0; i < stats.length; i += 3) {
    chunkedStats.push(stats.slice(i, i + 3));
  }

  function formatCurrency(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <AdminTemplate activeNav="dashboard">
      <div className="grid grid-cols-12 gap-4">
        {/* Grid pertama dengan width 40% */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-4">
          {chunkedStats.map((chunk, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* col 1-3 */}
              {chunk.map((stat) => (
                <StatCard
                  key={stat.key}
                  icon={stat.icon}
                  label={stat.label}
                  value={data[stat.key]}
                />
              ))}
            </div>
          ))}

          {/* col 2, row 1- row 2 */}
          <div className="flex flex-col gap-4 bg-white-100 rounded-md p-4 h-full">
            <div className="flex justify-between items-start ">
              <h4 className="text-xl font-bold">Total Pendapatan</h4>
              <Link
                to="/admin/pemasukan"
                // className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <Icon
                  type={'arrow-top-right'}
                  className={'size-8 border border-primary-800 rounded-md'}
                  color="green"
                />
              </Link>
            </div>
            <p className="text-4xl font-bold">
              Rp. <span>{formatCurrency(5354000)}</span>
            </p>
            <p className="text-gray-500 text-sm">12% mengalami kenaikan dari sebelumnya</p>
          </div>
        </div>

        {/* Grid kedua dengan width 60% */}
        <div className="col-span-12 lg:col-span-7 bg-white-100 rounded-md p-4">
          <p>Status order baru</p>
        </div>
      </div>
    </AdminTemplate>
  );
}
