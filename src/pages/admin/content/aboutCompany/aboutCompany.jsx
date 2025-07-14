import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';

export default function AdminAboutCompany() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Tentang Perusahaan', path: location.pathname }];
  const navigate = useNavigate();

  return (
    <AdminTemplate activeNav={'tentang perusahaan'} breadcrumbItems={breadcrumbItems}>
      <div className="p-4 bg-white rounded-lg shadow border">
        <h1>Tentang Perusahaans</h1>
      </div>
    </AdminTemplate>
  );
}
