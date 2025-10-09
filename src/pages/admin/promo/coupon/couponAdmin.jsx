import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import Coupon from './content/coupon';

export default function CouponAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kupon', path: location.pathname }];

  return <AdminTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
    <Coupon />
  </AdminTemplate>;
}