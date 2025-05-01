import React from 'react';
import AdminTemplate from '../../template/templateAdmin';

export default function DashboardAdmin() {
  return (
    <AdminTemplate activeNav="dashboard">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </AdminTemplate>
  );
}
