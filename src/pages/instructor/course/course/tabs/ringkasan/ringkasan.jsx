import { useEffect } from 'react';
import Icon from '../../../../../../components/icons/icon';
import useCourseStore from '../../../../../../zustand/courseStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import WysiwygContent from '../../../../../../components/content/wysiwyg/WysiwygContent';
import useAuthStore from '../../../../../../zustand/authStore';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../../../zustand/confirmationModalStore';

// Komponen pesan default
function BelumDiatur() {
  return (
    <span className="w-fit inline-block text-red-500 font-normal text-sm p-2 bg-error-100 px-3 py-1 rounded-md">
      Belum diatur, silahkan edit untuk mengaturnya!
    </span>
  );
}

// Utilitas untuk menampilkan value atau pesan default
function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return <BelumDiatur />;
  }
  return value;
}

// Utilitas untuk format tanggal
function formatTanggal(value) {
  if (!value) {
    return <BelumDiatur />;
  }
  // Langsung tampilkan value jika gagal parsing
  const dateObj = new Date(value);
  if (isNaN(dateObj)) return value;
  const tanggal = dateObj.getDate();
  const bulanNama = value.split(' ')[1]; // Ambil nama bulan dari string asli
  const tahun = dateObj.getFullYear();
  return `${tanggal} ${bulanNama} ${tahun}`;
}

function StatusLabelBlock({ active, children }) {
  return (
    <span
      className={`w-fit inline-block font-normal text-sm px-3 py-1 rounded-md ${
        active ? 'text-white bg-primary-700' : 'text-white bg-error-700'
      }`}
    >
      {children}
    </span>
  );
}

function displayHarga(price, fallback) {
  if (price === null || price === undefined || price === '') {
    return fallback ? fallback : <BelumDiatur />;
  }
  return `Rp. ${Number(price).toLocaleString('id-ID')}`;
}

function displayDiskonKursus(data) {
  if (data.is_discount_active !== 1) {
    return <StatusLabelBlock active={false}>Tidak Aktif</StatusLabelBlock>;
  }
  if (data.discount_type === 'percent') {
    return (
      <div className="flex items-center gap-2">
        <StatusLabelBlock active={true}>Aktif</StatusLabelBlock>
        <p>{data.discount_value}%</p>
      </div>
    );
  }
  if (data.discount_type === 'nominal') {
    return (
      <div className="flex items-center gap-2">
        <StatusLabelBlock active={true}>Aktif</StatusLabelBlock>
        <p>Rp. {Number(data.discount_value).toLocaleString('id-ID')}</p>
      </div>
    );
  }
  return <BelumDiatur />;
}

function displayLamaDiskon(data) {
  if (data.is_discount_active !== 1) {
    return <StatusLabelBlock active={false}>Tidak Aktif</StatusLabelBlock>;
  }
  const start = data.discount_start_at;
  const end = data.discount_end_at;

  if (start && end) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <StatusLabelBlock active={true}>Mulai</StatusLabelBlock>
          <span className="text-gray-700">{formatTanggal(start)}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusLabelBlock active={false}>Selesai</StatusLabelBlock>
          <span className="text-gray-700">{formatTanggal(end)}</span>
        </div>
      </div>
    );
  }
  if (start) {
    return (
      <div className="flex items-center gap-2">
        <StatusLabelBlock active={true}>Mulai</StatusLabelBlock>
        <span className="text-gray-700">{formatTanggal(start)}</span>
      </div>
    );
  }
  if (end) {
    return (
      <div className="flex items-center gap-2">
        <StatusLabelBlock active={false}>Selesai</StatusLabelBlock>
        <span className="text-gray-700">{formatTanggal(end)}</span>
      </div>
    );
  }
  return <StatusLabelBlock active={true}>Tanpa tenggat waktu</StatusLabelBlock>;
}

// Komponen InfoItem untuk merapikan tampilan info utama
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <span className="bg-secondary-100 rounded-full aspect-square flex items-center justify-center w-12 h-12">
        <Icon type={icon} className="h-6 w-6 text-primary-700" />
      </span>
      <div>
        <p className="font-semibold text-lg text-primary-800">{label}</p>
        {label === 'Level' && value && typeof value === 'object' && value.label ? (
          <span
            className={`inline-block ${value.bg} p-2 rounded text-center min-w-[80px]`}
            style={{ minWidth: '80px' }}
          >
            {value.label}
          </span>
        ) : (
          <p className="text-md text-gray-700">{value}</p>
        )}
      </div>
    </div>
  );
}

function displayLevel(level) {
  if (!level) return <BelumDiatur />;
  const mapping = {
    beginner: { label: 'Pemula', bg: 'bg-primary-100 text-primary-700' },
    intermediate: { label: 'Menengah', bg: 'bg-yellow-100 text-yellow-700' },
    advance: { label: 'Mahir', bg: 'bg-blue-100 text-blue-700' },
  };
  const info = mapping[level.toLowerCase()];
  if (!info) return <BelumDiatur />;
  return info;
}

export default function CourseRingkasan({ editable }) {
  const { id } = useParams();
  const tab = 'overview';
  const navigate = useNavigate();
  const {
    fetchCourseDetailByTab,
    courseDetailByTab,
    courseDetailLoading,
    courseDetailError,
    updateCourseDetail,
  } = useCourseStore();
  const { openModal, closeModal } = useConfirmationModalStore();

  const role = useAuthStore((state) => state.user.role);

  useEffect(() => {
    if (id && tab) {
      fetchCourseDetailByTab({ tab, id });
    }
  }, [id, tab, fetchCourseDetailByTab]);

  if (courseDetailLoading) return <div>Loading...</div>;
  if (courseDetailError) return <div className="text-red-500">{courseDetailError}</div>;
  if (!courseDetailByTab) return <div>Data tidak ditemukan</div>;

  const data = courseDetailByTab;
  if (!data) return <div>Data tidak ditemukan</div>;

  // Cek apakah gambar sudah diatur
  const isImageSet = !!data.image && data.image !== '';
  const imageUrl = isImageSet ? data.image : null;

  const handlePublish = async () => {
    openModal({
      title: 'Konfirmasi Publikasi',
      message: 'Apakah Anda yakin ingin mengajukan publikasi kursus ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          const formData = new FormData();
          formData.append('status', 'awaiting_approval');

          const res = await updateCourseDetail({
            id,
            data: formData,
          });

          if (res.status === 'success') {
            toast.success(res.message || 'Berhasil memperbarui ringkasan!');
            navigate('/instruktur/kursus');
          } else {
            toast.error(res.message || 'Gagal memperbarui ringkasan');
          }
        } catch (err) {
          console.error(err);
          toast.error(err.message || 'Gagal menyimpan data');
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <p className="text-2xl font-bold text-primary-900">Ringkasan</p>
        <div className="flex flex-col md:flex-row gap-2">
          {role === 'instructor' && (data.status === 'new' || data.status === 'edited') && (
            <button
              className="p-2 px-4 bg-tertiary-600 rounded-md text-white flex gap-1 items-center"
              onClick={handlePublish}
            >
              <Icon type="send" className="h-5 w-5" />
              Ajukan Publikasi
            </button>
          )}
          {role === 'admin' && (
            <button
              className="p-2 px-4 bg-tertiary-600 rounded-md text-white flex gap-1 items-center"
              onClick={() => navigate(`/admin/kursus/${id}/edit/harga`)}
            >
              <Icon type="tag-label" className="h-5 w-5" />
              Harga & Diskon
            </button>
          )}
          {role !== 'admin' && (
            <Link
              to={`/${role === 'admin' ? 'admin' : 'instruktur'}/kursus/${id}/edit/ringkasan`}
              className="flex items-center gap-2 bg-secondary-500 text-white px-4 py-1 md:py-2 rounded-lg shadow hover:bg-secondary-600 transition font-medium text-base"
            >
              <Icon type="edit" className="h-3 w-3" />
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6 col-span-2">
          <InfoItem icon="book" label="Nama Kursus" value={displayValue(data.title)} />
          <InfoItem
            icon="user"
            label="Nama Instruktur"
            value={displayValue(data.instructor?.full_name)}
          />
          <InfoItem icon="book" label="Kategori" value={displayValue(data.category?.name)} />
          <InfoItem icon="star-circle-outline" label="Level" value={displayLevel(data.level)} />
          <InfoItem icon="update" label="Update terakhir" value={formatTanggal(data.updated_at)} />
        </div>
        {/* Right Column (Image) */}
        <div className="flex flex-col items-start col-span-1">
          <div className="flex justify-start items-center gap-4 mb-4">
            <span className="text-3xl bg-secondary-100 rounded-full p-2">
              <Icon type="image" className="h-6 w-6 text-primary-700" />
            </span>
            <p className="font-semibold text-lg text-primary-800 mb-2">Gambar</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center w-full min-h-64">
            {isImageSet ? (
              <img
                src={imageUrl}
                alt="Course"
                className="w-full max-w-64 max-h-64 object-cover rounded-lg shadow border"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-48">
                <Icon type="image-off" className="h-12 w-12 text-gray-400 mb-2" />
                <BelumDiatur />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />

      {/* Diskon Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-6 col-span-1">
          <InfoItem icon="money" label="Harga Kursus" value={displayHarga(data.price)} />
          <InfoItem
            icon="money"
            label="Harga Setelah Diskon"
            value={
              data.price && (!data.discounted_price || data.discounted_price === '') ? (
                <StatusLabelBlock active={false}>Tidak Ada Diskon</StatusLabelBlock>
              ) : (
                displayHarga(data.discounted_price)
              )
            }
          />
        </div>
        <div className="flex flex-col items-start col-span-1">
          <InfoItem icon="tag-label" label="Diskon Kursus" value={displayDiskonKursus(data)} />
        </div>
        <div className="flex flex-col items-start col-span-1">
          <InfoItem icon="time" label="Lama Diskon" value={displayLamaDiskon(data)} />
        </div>
      </div>

      {/* Divider baru sebelum detail */}
      <div className="border-t border-gray-200 my-8" />

      {/* Detail yang akan dipelajari */}
      <div className="flex flex-col">
        <p className="font-semibold text-lg text-primary-800 mb-2">Detail yang akan dipelajari</p>
        {!data.detail || data.detail === '' ? (
          <BelumDiatur />
        ) : (
          <WysiwygContent html={data.detail} />
        )}
      </div>
    </>
  );
}
