import React from 'react';
import AdminTemplate from '../../template/templateAdmin';
import StatCard from '../../components/card/statCard';
import dashboardStore from '../../zustand/temporaryDummyData/dashboardStore';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../components/icons/icon';
import LineChart from '../../components/chart/lineChart';
import CourseTopicChart from '../../components/chart/courseTopicChart';

export default function DashboardAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Dashboard', path: location.pathname }];

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
    <AdminTemplate activeNav="dashboard" breadcrumbItems={breadcrumbItems}>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grid pertama dengan width 40% */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
            {chunkedStats.map((chunk, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="flex flex-col gap-4 bg-white rounded-md p-4 px-8 shadow-md">
              <div className="flex justify-between items-center">
                <h4 className="text-lg md:text-xl font-bold">Total Pendapatan</h4>
                <Link to="/admin/pemasukan">
                  <Icon
                    type="arrow-top-right"
                    className="size-6 md:size-8 border border-primary-800 rounded-md"
                    color="green"
                  />
                </Link>
              </div>
              <p className="text-3xl md:text-4xl font-bold">
                Rp. <span>{formatCurrency(5354000)}</span>
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                12% mengalami kenaikan dari sebelumnya
              </p>
            </div>
          </div>

          {/* Grid kedua dengan width 60% */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-md p-4 shadow-md">
            <p className="text-xl font-semibold">Progress course</p>
            <CourseTopicChart />
          </div>
        </div>
        <div className="bg-white rounded-md p-4 shadow-md">
          <p className="text-xl font-semibold">Grafik Pendapatan Bulanan</p>
          <LineChart data={data.chartData} />
        </div>
      </div>
    </AdminTemplate>
  );
}
