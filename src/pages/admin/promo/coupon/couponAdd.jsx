import React, { useState } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../../components/icons/icon';
import Button from '../../../../components/button/button';
import TextInput from '../../../../components/form/textInput';
import SelectOption from '../../../../components/form/selectOption';
import DatePicker from '../../../../components/form/datePicker';
import Checkbox from '../../../../components/form/checkbox';
import useCouponStore from '../../../../zustand/couponStore';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore'; // ADD
import { toast } from 'react-toastify'; // ADD

export default function CouponAdd() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Tambah Kupon', path: location.pathname },
  ];
  const navigate = useNavigate();

  const addCoupon = useCouponStore((state) => state.addCoupon);
  const { openModal, closeModal } = useConfirmationModalStore(); // ADD

  // Form state
  const [form, setForm] = useState({
    title: '',
    code: '',
    type: '',
    value: '',
    start_at: '',
    end_at: '',
    is_active: false,
    max_usage: '',
  });

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((prev) => ({
      ...prev,
      code,
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'code' ? value.toUpperCase() : value,
      }));
    }
  };

  // Coupon type options
  const typeOptions = [
    { value: 'percent', label: 'Persen (%)' },
    { value: 'nominal', label: 'Nominal (Rp)' },
  ];

  // REPLACE handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan kupon ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          const result = await addCoupon(form);
          toast.success('Kupon berhasil ditambahkan!');
          navigate('/admin/kupon');
        } catch (err) {
          toast.error('Gagal menambah kupon: ' + err.message);
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <AdminTemplate activeNav="kupon" breadcrumbItems={breadcrumbItems}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start mb-4">
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
            onClick={() => navigate(-1)}
          >
            <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
            <span>Kembali</span>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Tambah Kupon</h2>

        {/* content */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            label="Judul Kupon"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Masukkan judul kupon"
            required
          />
          <TextInput
            label="Kode Kupon"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Masukkan kode kupon"
            required
            rightButton={
              <button
                type="button"
                className="bg-primary-600 text-white px-2 py-1 rounded text-xs hover:bg-primary-700"
                onClick={generateCouponCode}
                tabIndex={-1}
                style={{ whiteSpace: 'nowrap' }}
              >
                Generate
              </button>
            }
          />
          <SelectOption
            label="Tipe Kupon"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={typeOptions}
            placeholder="Pilih tipe kupon"
            required
          />
          <TextInput
            label={form.type === 'percent' ? 'Nilai Kupon (%)' : 'Nilai Kupon (Rp)'}
            name="value"
            value={form.value}
            onChange={handleChange}
            placeholder={
              form.type === 'percent' ? 'Masukkan persen kupon' : 'Masukkan nominal kupon'
            }
            type={form.type === 'percent' ? 'number' : 'text'}
            isPrice={form.type === 'nominal'}
            disabled={!form.type}
            min={form.type === 'percent' ? 0 : undefined}
            max={form.type === 'percent' ? 100 : undefined}
            required
          />
          <DatePicker
            label="Tanggal Mulai"
            name="start_at"
            value={form.start_at}
            onChange={handleChange}
          />
          <DatePicker
            label="Tanggal Selesai"
            name="end_at"
            value={form.end_at}
            onChange={handleChange}
          />
          <TextInput
            label="Maksimal Penggunaan"
            name="max_usage"
            value={form.max_usage}
            onChange={handleChange}
            placeholder="Masukkan maksimal penggunaan (opsional)"
            type="number"
          />
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              label="Aktifkan Kupon"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" variant="form">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
