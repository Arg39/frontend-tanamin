import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import Icon from '../../../../components/icons/icon';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import DatePicker from '../../../../components/form/datePicker';
import Checkbox from '../../../../components/form/checkbox';
import useCourseStore from '../../../../zustand/courseStore';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';

export default function HargaEdit() {
  const location = useLocation();
  const { id } = useParams();
  const breadcrumbItems = [
    { label: 'Ringkasan', path: `/admin/kursus/${id}/lihat/ringkasan` },
    { label: 'Edit Harga dan Diskon', path: location.pathname },
  ];
  const navigate = useNavigate();
  const { updateCoursePrice, courseDetailLoading, fetchCourseDetailByTab, courseDetailByTab } =
    useCourseStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  // State
  const [form, setForm] = useState({
    price: '',
    discount_type: '',
    discount_value: '',
    discount_start_at: '',
    discount_end_at: '',
    is_discount_active: false,
  });

  // Track initial discount values for each type
  const initialDiscountValues = useRef({
    percent: '',
    nominal: '',
  });

  // Track last selected discount type
  const lastDiscountType = useRef('');

  // Track if user manually changed discount_value
  const userChangedDiscountValue = useRef(false);

  // Fetch initial data
  useEffect(() => {
    fetchCourseDetailByTab({ tab: 'overview', id });
    // eslint-disable-next-line
  }, [id]);

  function parseIndonesianDate(dateStr) {
    if (!dateStr) return '';
    const months = {
      Januari: '01',
      Februari: '02',
      Maret: '03',
      April: '04',
      Mei: '05',
      Juni: '06',
      Juli: '07',
      Agustus: '08',
      September: '09',
      Oktober: '10',
      November: '11',
      Desember: '12',
    };
    const regex = /^(\d{1,2}) (\w+) (\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return '';
    const [_, day, monthName, year] = match;
    const month = months[monthName];
    if (!month) return '';
    // Pad day to 2 digits
    const dayPadded = day.padStart(2, '0');
    return `${year}-${month}-${dayPadded}`;
  }

  useEffect(() => {
    if (courseDetailByTab) {
      setForm({
        price: courseDetailByTab.price ?? '',
        discount_type: courseDetailByTab.discount_type ?? '',
        discount_value:
          courseDetailByTab.discount_value !== null &&
          courseDetailByTab.discount_value !== undefined
            ? courseDetailByTab.discount_value
            : '',
        discount_start_at: parseIndonesianDate(courseDetailByTab.discount_start_at) ?? '',
        discount_end_at: parseIndonesianDate(courseDetailByTab.discount_end_at) ?? '',
        is_discount_active:
          courseDetailByTab.is_discount_active === 1 ||
          courseDetailByTab.is_discount_active === true
            ? true
            : false,
      });

      // Set initial discount values for both types
      initialDiscountValues.current = {
        percent:
          courseDetailByTab.discount_type === 'percent'
            ? courseDetailByTab.discount_value ?? ''
            : '',
        nominal:
          courseDetailByTab.discount_type === 'nominal'
            ? courseDetailByTab.discount_value ?? ''
            : '',
      };
      lastDiscountType.current = courseDetailByTab.discount_type ?? '';
      userChangedDiscountValue.current = false;
    }
  }, [courseDetailByTab]);

  // Handlers
  const handleChange = (e) => {
    if (e && e.target && typeof e.target.checked === 'boolean') {
      const { name, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (e && e.target) {
      const { name, value } = e.target;

      // Handle discount_type change logic
      if (name === 'discount_type') {
        // If type changed
        if (value !== lastDiscountType.current) {
          // Save current value for previous type
          if (lastDiscountType.current) {
            initialDiscountValues.current[lastDiscountType.current] = form.discount_value;
          }
          // Reset discount_value to empty
          setForm((prev) => ({
            ...prev,
            discount_type: value,
            discount_value: '',
          }));
          userChangedDiscountValue.current = false;
        } else {
          // If type is same as before, restore initial value if user hasn't changed
          setForm((prev) => ({
            ...prev,
            discount_type: value,
            discount_value: userChangedDiscountValue.current
              ? prev.discount_value
              : initialDiscountValues.current[value] ?? '',
          }));
        }
        lastDiscountType.current = value;
      } else if (name === 'discount_value') {
        // Mark that user changed the value
        userChangedDiscountValue.current = true;
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const discountTypeOptions = [
    { value: 'percent', label: 'Persen (%)' },
    { value: 'nominal', label: 'Nominal (Rp)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan perubahan harga dan diskon?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          const res = await updateCoursePrice({
            id,
            price: form.price,
            discount_type: form.discount_type,
            discount_value: form.discount_value,
            discount_start_at: form.discount_start_at,
            discount_end_at: form.discount_end_at,
            is_discount_active: form.is_discount_active,
          });
          if (res.status === 'success') {
            toast.success('Harga dan diskon berhasil diperbarui!');
            navigate(-1);
          } else {
            toast.error(res.message || 'Gagal memperbarui harga dan diskon');
          }
        } catch (err) {
          toast.error('Terjadi kesalahan: ' + err.message);
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  // Prevent form render until data loaded
  if (!courseDetailByTab && courseDetailLoading) {
    return (
      <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
        <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <span className="text-primary-700 font-semibold">Memuat data kursus...</span>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate activeNav="kursus" breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
          type="button"
        >
          <Icon type="arrow-left" className="size-[1rem] text-white" />
          Kembali
        </button>
        <h1 className="text-2xl font-bold mb-4 text-primary-900">Edit Harga dan Diskon</h1>

        {/* isi content */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Section Harga Kursus */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary-800">Harga Kursus</h2>
            <TextInput
              label="Harga Kursus"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Masukkan harga kursus"
              isPrice
            />
          </div>

          {/* Separator */}
          <hr className="my-4 border-gray-300" />

          {/* Section Diskon */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-primary-800">Diskon</h2>
            <SelectOption
              label="Tipe Diskon"
              name="discount_type"
              value={form.discount_type}
              onChange={handleChange}
              options={discountTypeOptions}
              placeholder="Pilih tipe diskon"
            />
            <TextInput
              label="Nilai Diskon"
              name="discount_value"
              value={
                form.discount_value === null || form.discount_value === undefined
                  ? ''
                  : form.discount_value
              }
              onChange={handleChange}
              placeholder={
                form.discount_type === 'percent'
                  ? 'Masukkan persen diskon'
                  : 'Masukkan nominal diskon'
              }
              type={form.discount_type === 'percent' ? 'number' : 'text'}
              isPrice={form.discount_type === 'nominal'}
              disabled={!form.discount_type}
              min={form.discount_type === 'percent' ? 0 : undefined}
              max={form.discount_type === 'percent' ? 100 : undefined}
            />
            <DatePicker
              label="Tanggal Mulai Diskon"
              name="discount_start_at"
              value={form.discount_start_at}
              onChange={handleChange}
            />
            <DatePicker
              label="Tanggal Selesai Diskon"
              name="discount_end_at"
              value={form.discount_end_at}
              onChange={handleChange}
            />
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                label="Aktifkan Diskon"
                name="is_discount_active"
                checked={form.is_discount_active}
                onChange={handleChange}
                disabled={false}
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="bg-primary-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-primary-800 w-fit"
              disabled={courseDetailLoading}
            >
              {courseDetailLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
