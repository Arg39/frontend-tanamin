import React, { useEffect } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCategoryStore from '../../../zustand/categoryStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';

export default function Category() {
  const {
    categories,
    fetchCategories,
    pagination,
    sortBy,
    sortOrder,
    perPage,
    error,
    deleteCategory,
  } = useCategoryStore();

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
  const openModal = useConfirmationModalStore((state) => state.openModal);

  const columns = [
    {
      Header: 'Nama',
      accessor: 'name',
      width: '20%',
    },
    {
      Header: 'Gambar',
      accessor: 'image',
      width: '45%',
      disableSort: true,
      Cell: ({ value }) => (
        <img
          src={`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${value}`}
          alt="Category"
          className="sm:mx-auto h-24 object-cover rounded"
        />
      ),
    },
    {
      Header: 'penggunaan',
      accessor: 'used',
      width: '5%',
      disableSort: true,
      Cell: ({ value }) => <p className="flex md:justify-center">{value} course</p>,
    },
    {
      Header: 'Tanggal',
      accessor: 'updated_at',
      width: '15%',
      Cell: ({ value }) => {
        if (!value) return '-';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(date);
      },
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => (
        <div className="w-fit flex flex-col gap-2 justify-center items-start text-md">
          <Button
            variant="primary"
            to={`/admin/kategori/edit/${value}`}
            className="p-1 px-4 rounded-md bg-secondary-800 hover:bg-secondary-700 text-white-100"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              openModal({
                title: 'Konfirmasi hapus',
                message: 'Apakah Anda yakin menghapus?',
                onConfirm: () => {
                  deleteCategory(value);
                },
                onCancel: () => {},
              });
            }}
            className="p-1 px-4 rounded-md bg-red-500 hover:bg-red-700 text-white-100"
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminTemplate activeNav="kategori">
        <div className="bg-white-100 p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
            <h2 className="text-2xl font-bold">Daftar Kategori</h2>
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
