import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Coupon from '../../admin/promo/coupon/content/coupon';
import InstructorTemplate from '../../../template/templateInstructor';

export default function CouponInstructor() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kupon', path: location.pathname }];

  return (
    <InstructorTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <Coupon />
    </InstructorTemplate>
  );
}
