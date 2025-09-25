import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Template from '../../../../../template/template';
import Breadcrumb from '../../../../../components/breadcrumb/breadcrumb';
import Checkout from './checkout';
import Icon from '../../../../../components/icons/icon';

export default function BuyNowCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId}` },
    { label: 'Beli Sekarang', path: location.pathname },
  ];

  // Dummy data
  const benefit = [
    'Akses course selamanya',
    'Sertifikat setelah menyelesaikan course',
    'Akses ke grup diskusi eksklusif',
    'Materi tambahan dan sumber daya',
    'Dukungan dari instruktur',
    'Pembaruan materi course secara berkala',
    'Akses ke webinar dan sesi tanya jawab',
    'Diskon untuk course berikutnya',
    'Akses offline melalui unduhan materi',
    'Komunitas pembelajar untuk berbagi pengalaman',
  ];
  const course = {
    title: 'bayangkan jika kita tidak menyerah',
    total: 150000,
    discount: 30000,
    image:
      'https://cdn.prod.website-files.com/66d68e94a0ccdabe3d6f6880/686772d9583aafe8d769f396_warmindo%20adalah.webp',
  };

  return (
    <Template activeNav="course.course" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <button
          type="button"
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4 text-white" />
          <span>Kembali</span>
        </button>
        <Checkout benefit={benefit} course={course} />
      </main>
    </Template>
  );
}
