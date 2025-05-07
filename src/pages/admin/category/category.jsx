import React, { useEffect } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCategoryStore from '../../../zustand/categoryStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';

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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Daftar Kategori</h1>
            <Button
              variant="primary"
              className="flex items-center px-2 gap-2"
              to={'/admin/kategori/tambah'}
            >
              <Icon type="plus" className="size-6" color="black" />
              <span className="text-lg font-normal">Kategori</span>
            </Button>
          </div>
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
