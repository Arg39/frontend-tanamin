import React from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import CouponEdit from './content/couponEdit';
import { useLocation } from 'react-router-dom';

export default function CouponEditAdmin() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Edit Kupon', path: location.pathname },
  ];

  return (
    <AdminTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <CouponEdit />
    </AdminTemplate>
  );
}
