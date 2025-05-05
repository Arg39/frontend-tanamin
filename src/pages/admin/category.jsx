import React, { useEffect } from 'react';
import AdminTemplate from '../../template/templateAdmin';
import useCategoryStore from '../../zustand/categoryStore';
import ReactTable from '../../components/table/reactTable';

export default function Category() {
  const { categories, fetchCategories, pagination, sortBy, sortOrder, perPage, error } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSortChange = (column, order) => {
    fetchCategories({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
    });
  };

  const handlePageChange = (page) => {
    fetchCategories({ sortBy, sortOrder, perPage, page });
  };

  const handlePageSizeChange = (size) => {
    fetchCategories({ sortBy, sortOrder, perPage: size, page: 1 });
  };

  const columns = [
    {
      Header: 'Nama',
      accessor: 'name',
    },
    {
      Header: 'Dibuat Pada',
      accessor: 'created_at',
      Cell: ({ value }) => {
        const options = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
        return new Date(value).toLocaleString('id-ID', options);
      },
    },
  ];

  return (
    <div>
      <AdminTemplate activeNav="kategori">
        <div className="bg-white-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Daftar Kategori</h1>
          {error && <p className="text-red-500">{error}</p>}
          <ReactTable
            columns={columns}
            data={categories}
            numbering={true}
            onSortChange={handleSortChange}
            pagination={{ ...pagination, perPage }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>
      </AdminTemplate>
    </div>
  );
}
