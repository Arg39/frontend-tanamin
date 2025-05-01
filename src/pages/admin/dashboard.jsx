import React from 'react';
import AdminTemplate from '../../template/templateAdmin';
import StatCard from '../../components/card/statCard';
import dashboardStore from '../../zustand/temporaryDummyData/dashboardStore';

export default function DashboardAdmin() {
  const { data } = dashboardStore();

  const stats = [
    { key: 'course', label: 'Course', icon: 'book' },
    { key: 'user', label: 'User', icon: 'user-filled' },
    { key: 'message', label: 'Message', icon: 'message-filled' },
  ];

  return (
    <AdminTemplate activeNav="dashboard">
      <div className="flex flex-row gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.key} icon={stat.icon} label={stat.label} value={data[stat.key]} />
        ))}
      </div>
    </AdminTemplate>
  );
}
