import React, { useEffect, useState } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import StatCard from '../../../components/card/statCard';
import dashboardStore from '../../../zustand/temporaryDummyData/dashboardStore';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import LineChart from '../../../components/chart/lineChart';
import CourseTopicChart from '../../../components/chart/courseTopicChart';

function getDefaultDates() {
  const today = new Date();
  const end = today.toISOString().slice(0, 10);
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  const start = lastMonth.toISOString().slice(0, 10);
  return { start, end };
}

export default function DashboardAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Dashboard', path: location.pathname }];

  const { data, loading, error, fetchDashboardAdmin } = dashboardStore();

  const { start, end } = getDefaultDates();
  // State untuk input filter (belum trigger fetch)
  const [filterStartDate, setFilterStartDate] = useState(start);
  const [filterEndDate, setFilterEndDate] = useState(end);
  // State untuk tanggal yang sedang digunakan fetch
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  useEffect(() => {
    fetchDashboardAdmin(startDate, endDate);
    // eslint-disable-next-line
  }, [startDate, endDate]);

  // Semua stat yang ada di response
  const stats = [
    { key: 'total_courses', label: 'Course', icon: 'book' },
    { key: 'total_users', label: 'User', icon: 'user-filled' },
    { key: 'total_messages', label: 'Message', icon: 'message-filled' },
    { key: 'total_faq', label: 'FAQ', icon: 'faq' },
    { key: 'total_categories', label: 'Category', icon: 'swatch' },
    { key: 'total_coupon', label: 'Coupon', icon: 'coupon' },
  ];

  function formatCurrency(value) {
    if (!value && value !== 0) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleFilter = (e) => {
    e.preventDefault();
    setStartDate(filterStartDate);
    setEndDate(filterEndDate);
  };

  if (loading) {
    return (
      <AdminTemplate activeNav="dashboard" breadcrumbItems={breadcrumbItems}>
        <div className="flex justify-center items-center h-96">Loading...</div>
      </AdminTemplate>
    );
  }

  if (error) {
    return (
      <AdminTemplate activeNav="dashboard" breadcrumbItems={breadcrumbItems}>
        <div className="flex justify-center items-center h-96 text-red-500">{error}</div>
      </AdminTemplate>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <AdminTemplate activeNav="dashboard" breadcrumbItems={breadcrumbItems}>
      <div className="flex flex-col gap-6">
        {/* Atas: StatCard & Progress */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* StatCard & Total Pendapatan */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.key}
                  icon={stat.icon}
                  label={stat.label}
                  value={data[stat.key]}
                  className="h-full"
                />
              ))}
            </div>
            <div className="bg-white rounded-md p-4 px-8 shadow-md flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-lg md:text-xl font-bold">Total Pendapatan</h4>
                <Link to="/admin/pendapatan">
                  <Icon
                    type="arrow-top-right"
                    className="size-6 md:size-8 border border-primary-800 rounded-md"
                    color="green"
                  />
                </Link>
              </div>
              <p className="text-3xl md:text-4xl font-bold">
                Rp. <span>{formatCurrency(data.total_revenue)}</span>
              </p>
              <p className="text-gray-500 text-sm md:text-base">
                {/* Placeholder, ideally this should be calculated from API */}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {/* Filter Tanggal */}
            <form
              className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end items-start md:items-center bg-white p-2 rounded-md shadow-md"
              onSubmit={handleFilter}
            >
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                <label className="font-medium text-gray-700">
                  Mulai:
                  <input
                    type="date"
                    className="ml-2 border rounded px-2 py-1"
                    value={filterStartDate}
                    max={filterEndDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </label>
                <label className="font-medium text-gray-700">
                  Sampai:
                  <input
                    type="date"
                    className="ml-2 border rounded px-2 py-1"
                    value={filterEndDate}
                    min={filterStartDate}
                    max={getDefaultDates().end}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </label>
              </div>
              <button
                type="submit"
                className="bg-primary-800 text-white px-4 py-1 rounded-md font-semibold hover:bg-primary-700 transition"
              >
                Filter
              </button>
            </form>
            {/* Progress Course */}
            <div className="flex-1 bg-white rounded-md p-4 shadow-md flex flex-col justify-between">
              <p className="text-xl font-semibold mb-2">Progress Course</p>
              <CourseTopicChart progress={data.progress} />
            </div>
          </div>
        </div>
        {/* Grafik Pendapatan */}
        <div className="bg-white rounded-md p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <p className="text-xl font-semibold">Grafik Pendapatan</p>
            <div className="text-sm text-gray-500 mt-2 md:mt-0"></div>
          </div>
          <div className="w-full h-72 md:h-96">
            <LineChart
              data={
                Array.isArray(data.revenue_chart)
                  ? {
                      labels: data.revenue_chart.map((item) => item.day),
                      values: data.revenue_chart.map((item) => Number(item.total)),
                    }
                  : { labels: [], values: [] }
              }
            />
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}
