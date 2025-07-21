import { useEffect } from 'react';
import Icon from '../../../../../components/icons/icon';
import useCourseStore from '../../../../../zustand/courseStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';
import useAuthStore from '../../../../../zustand/authStore';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';

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
  const bulan = [
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
  const dateObj = new Date(value);
  if (isNaN(dateObj)) return <BelumDiatur />;
  const tanggal = dateObj.getDate();
  const bulanNama = bulan[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();
  return `${tanggal} ${bulanNama} ${tahun}`;
}

// Utilitas untuk format harga
function displayHarga(price) {
  if (price === null || price === undefined || price === '') {
    return <BelumDiatur />;
  }
  return `Rp. ${Number(price).toLocaleString('id-ID')}`;
}

// Komponen InfoItem untuk merapikan tampilan info utama
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-3xl bg-secondary-100 rounded-full p-2 flex items-center justify-center w-12 h-12">
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
            navigate(-1);
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
        <p className="text-2xl font-bold text-primary-900">Ringaksan</p>
        <div className="flex flex-col md:flex-row gap-2">
          {role === 'instructor' && (data.status === 'new' || data.status === 'edited') && (
            <button
              className="p-2 bg-tertiary-600 rounded-md text-white flex gap-1 items-center"
              onClick={handlePublish}
            >
              <Icon type="send" className="h-5 w-5" />
              Ajukan Publikasi
            </button>
          )}
          <Link
            to={`/${role === 'admin' ? 'admin' : 'instruktur'}/kursus/${id}/edit/ringkasan`}
            className="flex items-center gap-2 bg-secondary-500 text-white px-6 py-1 md:py-2 rounded-lg shadow hover:bg-secondary-600 transition font-medium text-base"
          >
            <Icon type="edit" className="h-4 w-4" />
            Edit
          </Link>
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
          <InfoItem icon="money" label="Harga" value={displayHarga(data.price)} />
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
