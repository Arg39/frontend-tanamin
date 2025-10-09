import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import CouponAdd from './content/couponAdd';

export default function CouponAdminAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Tambah Kupon', path: location.pathname },
  ];

  return (
    <AdminTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <CouponAdd />
    </AdminTemplate>
  );
}
