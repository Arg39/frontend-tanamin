import { useEffect } from 'react';
import Icon from '../../../../../components/icons/icon';
import useCourseStore from '../../../../../zustand/courseStore';
import { Link, useParams } from 'react-router-dom';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';

// Komponen pesan default
function BelumDiatur() {
  return (
    <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-md">
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
      <span className="text-3xl bg-secondary-100 rounded-full p-2">
        <Icon type={icon} className="h-6 w-6 text-primary-700" />
      </span>
      <div>
        <p className="font-semibold text-lg text-primary-800">{label}</p>
        <p className="text-md text-gray-700">{value}</p>
      </div>
    </div>
  );
}

export default function CourseRingkasan({ editable }) {
  const { id, tab } = useParams();
  const { fetchCourseDetailByTab, courseDetailByTab, courseDetailLoading, courseDetailError } =
    useCourseStore();

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
  const isImageSet = !!data.image_video && data.image_video !== '';
  const imageUrl = isImageSet ? data.image_video : null;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <p className="text-2xl font-bold text-primary-900">Ringaksan</p>
        {editable && (
          <Link
            to={`/instruktur/kursus/edit/${id}/ringkasan`}
            className="flex items-center gap-2 bg-secondary-500 text-white-100 px-6 py-1 md:py-2 rounded-lg shadow hover:bg-secondary-600 transition font-medium text-base"
          >
            <Icon type="edit-light" className="h-5 w-5" />
            Edit
          </Link>
        )}
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
          <InfoItem icon="book" label="Kategori" value={displayValue(data.category.name)} />
          <InfoItem icon="star-circle-outline" label="Level" value={displayValue(data.level)} />
          <InfoItem icon="money" label="Harga" value={displayHarga(data.price)} />
          <InfoItem icon="update" label="Update terakhir" value={formatTanggal(data.created_at)} />
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
