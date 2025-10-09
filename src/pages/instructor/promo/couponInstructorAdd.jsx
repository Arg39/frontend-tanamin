import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CouponAdd from '../../admin/promo/coupon/content/couponAdd';
import InstructorTemplate from '../../../template/templateInstructor';

export default function CouponInstructorAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Tambah Kupon', path: location.pathname },
  ];

  return (
    <InstructorTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <CouponAdd />
    </InstructorTemplate>
  );
}
