import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';

export default function FaqAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'FAQ', path: location.pathname }];
  const navigate = useNavigate();

  return (
    <AdminTemplate activeNav={'faq'} breadcrumbItems={breadcrumbItems}>
      <div className="p-4 bg-white rounded-lg shadow border">
        <h1>Daftar Frequently Ask Question</h1>
      </div>
    </AdminTemplate>
  );
}
