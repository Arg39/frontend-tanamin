import React, { useState } from 'react';
import Template from '../template/template';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/breadcrumb2';

const faqList = [
  {
    question: 'Apa itu Tanamin Course?',
    answer:
      'Tanamin Course adalah platform kursus online yang dikembangkan oleh PT Tanamin Bumi Nusantara sebagai bagian dari inisiatif pemberdayaan masyarakat. Di sini, Anda dapat mengikuti berbagai pelatihan di bidang lingkungan, desain, teknologi, dan keterampilan lainnya secara gratis maupun berbayar.',
  },
  {
    question: 'Bagaimana cara mendaftar di Tanamin Course?',
    answer:
      'Anda dapat mendaftar dengan mengklik tombol "Daftar" di halaman utama dan mengisi formulir pendaftaran.',
  },
  {
    question: 'Apakah materi kursus bisa diakses gratis?',
    answer: 'Beberapa materi tersedia gratis, namun untuk akses penuh Anda perlu berlangganan.',
  },
  {
    question: 'Bagaimana cara menghubungi tim support?',
    answer: 'Anda bisa menghubungi kami melalui halaman kontak atau email support@tanamin.com.',
  },
];

export default function Faq() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Frequently Asked Questions', path: location.pathname },
  ];

  return (
    <Template activeNav="faq" locationKey={location.key}>
      <main className="min-h-screen bg-white-100 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Frequently Asked Question (FAQ)
          </h1>
          <p className="mt-4 text-primary-950 text-xl">
            Temukan jawaban atas pertanyaan Anda di bawah ini. Jika masih ada hal yang belum
            terjawab, jangan ragu untuk langsung menghubungi kami.
          </p>

          {/* faq */}
          <div className="mt-8 space-y-4">
            {faqList.map((item, idx) => (
              <div key={idx} className="border rounded-md border-primary-700 p-4">
                <button
                  className="w-full text-left text-lg font-semibold text-primary-800 focus:outline-none flex justify-between items-center"
                  onClick={() => handleToggle(idx)}
                >
                  {item.question}
                  <span className="text-primary-700 text-xl">{openIndex === idx ? '-' : '+'}</span>
                </button>
                {openIndex === idx && (
                  <div className="mt-2 text-primary-950 text-lg">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </Template>
  );
}
