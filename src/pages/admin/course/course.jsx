import React from 'react';
import { useEffect, useState } from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import useCourseStore from '../../../zustand/courseStore';
import ReactTable from '../../../components/table/reactTable';
import Button from '../../../components/button/button';
import Icon from '../../../components/icons/icon';
import useAuthStore from '../../../zustand/authStore';
import useCategoryStore from '../../../zustand/categoryStore';
import useInstructorStore from '../../../zustand/instructorStore';
import TableFilter from '../../../components/table/tableFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function Course() {
  const location = useLocation();
  const breadcrumbItems = [{ label: 'Kursus', path: location.pathname }];

  const navigate = useNavigate();
  const {
    courses,
    fetchCourses,
    pagination,
    sortBy,
    sortOrder,
    perPage,
    error,
    loading,
    deleteCourse,
    updateCourseDetail,
  } = useCourseStore();
  const { token } = useAuthStore();
  const { categories, fetchCategoryOptions } = useCategoryStore();
  const { instructorSelectOptions, fetchInstructorOptions } = useInstructorStore();

  const [filterValues, setFilterValues] = useState({
    search: '',
    category: '',
    instructor: '',
    date: { start: '', end: '' },
  });
  const [searchInput, setSearchInput] = useState('');

  const { openModal, closeModal } = useConfirmationModalStore();

  useEffect(() => {
    fetchCategoryOptions();
    fetchInstructorOptions();
  }, []);

  useEffect(() => {
    setSearchInput(filterValues.search || '');
  }, [filterValues.search]);

  useEffect(() => {
    if (token) {
      fetchCourses({
        sortBy,
        sortOrder,
        perPage,
        page: pagination.currentPage,
        search: filterValues.search,
        category: filterValues.category,
        instructor: filterValues.instructor,
        dateStart: filterValues.date.start,
        dateEnd: filterValues.date.end,
      });
    }
  }, [token, sortBy, sortOrder, perPage, pagination.currentPage, filterValues]);

  const handleSortChange = (column, order) => {
    fetchCourses({
      sortBy: column,
      sortOrder: order,
      perPage,
      page: pagination.currentPage,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageChange = (page) => {
    fetchCourses({
      sortBy,
      sortOrder,
      perPage,
      page,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePageSizeChange = (size) => {
    fetchCourses({
      sortBy,
      sortOrder,
      perPage: size,
      page: 1,
      search: filterValues.search,
      category: filterValues.category,
      instructor: filterValues.instructor,
      dateStart: filterValues.date.start,
      dateEnd: filterValues.date.end,
    });
  };

  const handlePublish = async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'published');

      const res = await updateCourseDetail({
        id,
        data: formData,
      });

      if (res.status === 'success') {
        toast.success(res.message || 'Berhasil memperbarui ringkasan!');
        navigate(-1);
      } else {
        toast.error(res.message || 'Gagal memperbarui ringkasan');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal menyimpan data');
    } finally {
    }
  };

  // Filtering table
  const filterConfigs = [
    {
      key: 'search',
      type: 'search',
      label: 'Cari Judul',
      placeholder: 'Cari kursus...',
      withButton: true,
    },
    {
      key: 'category',
      type: 'select',
      label: 'Kategori',
      placeholder: 'Semua Kategori',
      options: categories.map((cat) => ({ value: cat.id, label: cat.name })),
    },
    {
      key: 'instructor',
      type: 'select',
      label: 'Instruktur',
      placeholder: 'Semua Instruktur',
      options: instructorSelectOptions,
    },
    {
      key: 'date',
      type: 'dateRange',
      label: 'Tanggal',
    },
  ];

  // Table columns
  const columns = [
    {
      Header: 'Kursus',
      accessor: 'title',
      width: '35%',
    },
    {
      Header: 'Kategori',
      accessor: (row) => row.category?.name || '-',
      id: 'category',
      width: '15%',
      disableSort: true,
    },
    {
      Header: 'Instruktur',
      accessor: (row) => row.instructor?.full_name || '-',
      id: 'instructor',
      width: '15%',
      disableSort: true,
    },
    {
      Header: 'Status',
      accessor: 'status',
      width: '10%',
      disableSort: true,
      Cell: ({ value }) => {
        let label = '';
        let colorClass = '';
        switch (value) {
          case 'new':
            label = 'Baru';
            colorClass = 'bg-gray-200 text-gray-800';
            break;
          case 'edited':
            label = 'Diedit';
            colorClass = 'bg-yellow-200 text-yellow-800';
            break;
          case 'awaiting_approval':
            label = 'Menunggu Persetujuan';
            colorClass = 'bg-blue-200 text-blue-800';
            break;
          case 'published':
            label = 'Dipublikasikan';
            colorClass = 'bg-green-200 text-green-800';
            break;
          default:
            label = 'Tidak Diketahui';
            colorClass = 'bg-gray-100 text-gray-500';
        }
        return <div className={`inline-block px-2 py-1 rounded ${colorClass}`}>{label}</div>;
      },
    },
    {
      Header: 'Tanggal',
      accessor: 'updated_at',
      width: '15%',
      Cell: ({ value }) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(value));
      },
    },
    {
      Header: 'Aksi',
      accessor: 'id',
      width: '10%',
      disableSort: true,
      Cell: ({ row }) => {
        const course = row.original;

        return (
          <div className="w-fit flex flex-row md:flex-col gap-2 justify-center items-start text-md mt-2 md:mt-0">
            <button
              className="p-1 px-4 rounded-md bg-primary-700 text-white hover:bg-primary-800"
              onClick={() => {
                navigate(`/admin/kursus/${course.id}/lihat/ringkasan`);
              }}
            >
              Lihat
            </button>

            {course.status !== 'published' && (
              <button
                className="p-1 px-4 rounded-md bg-blue-500 hover:bg-blue-700 text-white"
                onClick={() =>
                  openModal({
                    title: 'Konfirmasi Publish',
                    message:
                      'Apakah Anda yakin ingin mem-publish kursus ini? Jika iya maka kursus ini akan tersedia untuk umum.',
                    onConfirm: async () => {
                      closeModal();
                      await handlePublish(course.id);
                    },
                    onCancel: () => {
                      closeModal();
                    },
                  })
                }
              >
                Publish
              </button>
            )}

            <button
              className="p-1 px-4 rounded-md bg-red-500 hover:bg-red-700 text-white"
              onClick={() => {
                openModal({
                  title: 'Konfirmasi Hapus',
                  message:
                    'Apakah Anda yakin ingin menghapus kusus ini?, jika iya, semua data terkait kursus ini akan dihapus.',
                  onConfirm: async () => {
                    closeModal();
                    try {
                      await deleteCourse(course.id);
                      toast.success('Kursus berhasil dihapus!');
                      fetchCourses({
                        sortBy,
                        sortOrder,
                        perPage,
                        page: pagination.currentPage,
                        search: filterValues.search,
                        category: filterValues.category,
                        instructor: filterValues.instructor,
                        dateStart: filterValues.date.start,
                        dateEnd: filterValues.date.end,
                      });
                    } catch (e) {
                      toast.error(`Gagal menghapus kursus: ${e.message}`);
                    }
                  },
                  onCancel: () => {
                    closeModal();
                  },
                });
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <h2 className="text-2xl font-bold mb-4">Daftar Kursus</h2>
          <Button
            variant="primary"
            className="flex items-center px-2 gap-2"
            to={'/admin/kursus/tambah'}
          >
            <Icon type="plus" className="size-6" color="black" />
            <span className="text-lg font-normal">Kursus</span>
          </Button>
        </div>
        {!token ? (
          <div className="text-center text-red-500 py-8">Anda belum login.</div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            <h4 className="mb-4 md:mb-2">Filtering</h4>
            <div className="mb-2 md:mb-6">
              <TableFilter
                filters={filterConfigs}
                values={filterValues}
                onFilterChange={setFilterValues}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            </div>
            <ReactTable
              columns={columns}
              data={courses}
              numbering={true}
              onSortChange={handleSortChange}
              pagination={{ ...pagination, perPage }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </>
        )}
      </div>
    </AdminTemplate>
  );
}
