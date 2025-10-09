import React, { useState, useEffect } from 'react';
import AdminTemplate from '../../../../../template/templateAdmin';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../../../components/icons/icon';
import Button from '../../../../../components/button/button';
import TextInput from '../../../../../components/form/textInput';
import SelectOption from '../../../../../components/form/selectOption';
import DatePicker from '../../../../../components/form/datePicker';
import Checkbox from '../../../../../components/form/checkbox';
import useCouponStore from '../../../../../zustand/couponStore';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../zustand/authStore';

// Helper: Convert "31 Juli 2025" to "2025-07-31"
function indoDateToISO(dateStr) {
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
  // Example: "31 Juli 2025"
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return '';
  const [day, monthIndo, year] = parts;
  const month = months[monthIndo];
  if (!month) return '';
  // Pad day to 2 digits
  const dayPad = day.padStart(2, '0');
  return `${year}-${month}-${dayPad}`;
}

// Helper: Convert "YYYY-MM-DD" to "31 Juli 2025"
function isoToIndoDate(isoStr) {
  if (!isoStr) return '';
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const [year, month, day] = isoStr.split('-');
  if (!year || !month || !day) return '';
  const monthIndo = months[parseInt(month, 10) - 1];
  return `${parseInt(day, 10)} ${monthIndo} ${year}`;
}

export default function CouponEdit() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Kupon', path: '/admin/kupon' },
    { label: 'Edit Kupon', path: location.pathname },
  ];
  const navigate = useNavigate();
  const { couponId } = useParams();
  const user = useAuthStore((state) => state.user);

  const getCouponById = useCouponStore((state) => state.getCouponById);
  const updateCoupon = useCouponStore((state) => state.updateCoupon);
  const { openModal, closeModal } = useConfirmationModalStore();

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoupon() {
      setLoading(true);
      try {
        const data = await getCouponById(couponId);
        setForm({
          title: data.title || '',
          code: data.code || '',
          type: data.type || '',
          value: data.value !== undefined ? String(data.value) : '',
          start_at: indoDateToISO(data.start_at), // convert to ISO for DatePicker
          end_at: indoDateToISO(data.end_at),
          is_active: !!data.is_active,
          max_usage: data.max_usage !== undefined ? String(data.max_usage) : '',
        });
      } catch (err) {
        toast.error('Gagal mengambil data kupon: ' + err.message);
      }
      setLoading(false);
    }
    fetchCoupon();
  }, [couponId, getCouponById]);

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

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox' || typeof checked === 'boolean') {
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

  // Handle DatePicker change to keep ISO format
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const typeOptions = [
    { value: 'percent', label: 'Persen (%)' },
    { value: 'nominal', label: 'Nominal (Rp)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin mengupdate kupon ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          // Send ISO date format directly
          const payload = {
            ...form,
            start_at: form.start_at, // ISO format
            end_at: form.end_at, // ISO format
          };
          await updateCoupon(couponId, payload);
          toast.success('Kupon berhasil diupdate!');
          if (user?.role === 'admin') {
            navigate('/admin/kupon');
          } else {
            navigate('/instruktur/kupon');
          }
        } catch (err) {
          toast.error('Gagal mengupdate kupon: ' + err.message);
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
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
      <h2 className="text-2xl font-bold mb-4">Edit Kupon</h2>

      {/* content */}
      {loading ? (
        <div className="text-center py-8">Memuat data kupon...</div>
      ) : (
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
            onChange={handleDateChange}
          />
          <DatePicker
            label="Tanggal Selesai"
            name="end_at"
            value={form.end_at}
            onChange={handleDateChange}
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
      )}
    </div>
  );
}
