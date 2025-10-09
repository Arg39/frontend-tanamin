import React from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import { useLocation } from 'react-router-dom';
import Category from './content/category';

export default function CategoryAdmin() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kategori', path: location.pathname }];
  return (
    <AdminTemplate activeNav="kategori" breadcrumbItems={breadcrumbItems}>
      <Category isEditable={true} />
    </AdminTemplate>
  );
}
