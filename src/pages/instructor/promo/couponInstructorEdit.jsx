import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CouponEdit from '../../admin/promo/coupon/content/couponEdit';
import InstructorTemplate from '../../../template/templateInstructor';

export default function CouponInstructorEdit() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Edit Kupon', path: location.pathname },
  ];

  return (
    <InstructorTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <CouponEdit />
    </InstructorTemplate>
  );
}
