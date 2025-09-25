import React, { useState } from 'react';
import Icon from '../../../../../components/icons/icon';
import { formatRupiah } from '../../../../../utils/formatRupiah';

export default function Checkout({ benefit, course, courses = [], multiple = false }) {
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Untuk multiple course
  const courseList = multiple ? courses : course ? [course] : [];
  const total = courseList.reduce((sum, c) => sum + (c.total || 0), 0);
  const discount = courseList.reduce((sum, c) => sum + (c.discount || 0), 0);
  const ppn = total * 0.12;
  const totalBayar = total - discount + ppn;

  // Modal Syarat & Ketentuan
  const TermsModal = () => {
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        setShowTerms(false);
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900 bg-opacity-40"
        onClick={handleBackdropClick}
      >
        <div className="bg-neutral-50 rounded-lg shadow-lg max-w-lg w-full p-6 relative mx-2">
          <button
            className="absolute top-2 right-2 text-neutral-500 hover:text-neutral-700"
            onClick={() => setShowTerms(false)}
            aria-label="Tutup"
          >
            <Icon type="close" className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-primary-700">Syarat &amp; Ketentuan</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-700">
            <li>
              Akses course hanya diberikan kepada pengguna yang telah melakukan pembayaran secara
              penuh.
            </li>
            <li>
              Materi course hanya untuk keperluan belajar pribadi dan tidak boleh disebarluaskan
              tanpa izin.
            </li>
            <li>Sertifikat akan diberikan setelah seluruh materi dan tugas course diselesaikan.</li>
            <li>
              Tidak diperkenankan melakukan tindakan plagiarisme atau pelanggaran hak cipta pada
              materi course.
            </li>
            <li>
              Pembayaran yang telah dilakukan tidak dapat dikembalikan kecuali terjadi kesalahan
              dari pihak penyelenggara.
            </li>
            <li>
              Dengan membeli course, Anda setuju untuk mematuhi seluruh peraturan yang berlaku di
              platform Tanamin.
            </li>
          </ol>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
              onClick={() => setShowTerms(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-4 flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="w-full md:w-1/2">
        {multiple ? (
          <div className="flex flex-col gap-4">
            {courseList.map((c, idx) => (
              <div key={idx} className="flex items-center gap-4 border rounded-lg p-2">
                <img className="w-20 h-20 object-cover rounded-lg" src={c.image} alt={c.title} />
                <div>
                  <div className="font-semibold text-base">{c.title}</div>
                  <div className="text-sm text-gray-500">{formatRupiah(c.total)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <img
            className="w-full h-40 sm:h-48 md:h-auto object-cover rounded-lg"
            src={course?.image}
            alt=""
          />
        )}
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-lg sm:text-xl font-semibold">Course Benefit</p>
          <div className="relative">
            <div
              className={`mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4 overflow-hidden transition-all duration-300 ${
                !showAllBenefits ? 'max-h-[200px] sm:max-h-[320px]' : 'max-h-none'
              }`}
              style={{
                maxHeight: !showAllBenefits
                  ? window.innerWidth < 640
                    ? '200px'
                    : '320px'
                  : 'none',
              }}
            >
              {benefit.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 aspect-square bg-primary-300 rounded-full">
                    <Icon type="check" className="text-primary-700" />
                  </div>
                  <span className="flex items-center text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
            {!showAllBenefits && benefit.length > 0 && (
              <div
                className="pointer-events-none absolute bottom-0 left-0 w-full h-16 sm:h-32 bg-gradient-to-t from-white via-white/80 to-transparent transition-opacity duration-300"
                style={{ zIndex: 1 }}
              />
            )}
          </div>
          {benefit.length > 0 && (
            <div className="mt-2 flex justify-between items-center relative z-10">
              <button
                type="button"
                className="text-primary-700 font-medium hover:underline flex items-center gap-2 text-sm sm:text-base"
                onClick={() => setShowAllBenefits((prev) => !prev)}
              >
                {showAllBenefits ? 'Tampilkan lebih sedikit' : 'Tampilkan Lebih Banyak'}
              </button>
              <span>
                <Icon
                  type={showAllBenefits ? 'arrow-up' : 'arrow-down'}
                  className="w-5 h-5 text-primary-700"
                />
              </span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Course</p>
            <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Total</p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {multiple ? (
              <>
                {courseList.map((c, idx) => (
                  <div
                    key={idx}
                    className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center"
                  >
                    <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">{c.title}</p>
                    <p className="text-sm sm:text-base">{formatRupiah(c.total)}</p>
                  </div>
                ))}
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">Sub Total</p>
                  <p className="text-sm sm:text-base">{formatRupiah(total)}</p>
                </div>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">Diskon</p>
                  <p className="text-sm sm:text-base">{formatRupiah(discount)}</p>
                </div>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">PPN 12%</p>
                  <p className="text-sm sm:text-base">{formatRupiah(ppn)}</p>
                </div>
                <div className="mt-3 sm:mt-4 mb-3 sm:mb-4 flex justify-between items-center">
                  <p className="text-lg sm:text-xl font-bold">Total Bayar</p>
                  <p className="text-lg sm:text-xl font-bold">{formatRupiah(totalBayar)}</p>
                </div>
              </>
            ) : (
              <>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">{course?.title}</p>
                  <p className="text-sm sm:text-base">{formatRupiah(course?.total)}</p>
                </div>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">Sub Total</p>
                  <p className="text-sm sm:text-base">{formatRupiah(course?.total)}</p>
                </div>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">Diskon</p>
                  <p className="text-sm sm:text-base">{formatRupiah(course?.discount)}</p>
                </div>
                <div className="pb-2 border-b border-gray-200 mb-2 sm:mb-4 flex justify-between items-center">
                  <p className="w-8/12 sm:w-10/12 text-sm sm:text-base">PPN 12%</p>
                  <p className="text-sm sm:text-base">{formatRupiah(course?.total * 0.12)}</p>
                </div>
                <div className="mt-3 sm:mt-4 mb-3 sm:mb-4 flex justify-between items-center">
                  <p className="text-lg sm:text-xl font-bold">Total Bayar</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {formatRupiah(course?.total - course?.discount + course?.total * 0.12)}
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <input
                type="checkbox"
                id="syaratKetentuan"
                checked={isChecked}
                onChange={() => setIsChecked((prev) => !prev)}
                className="w-4 h-4 accent-tertiary-600"
              />
              <label htmlFor="syaratKetentuan" className="text-xs sm:text-sm select-none">
                Saya telah membaca dan menyetujui{' '}
                <button
                  type="button"
                  className="font-semibold text-tertiary-500 underline hover:text-tertiary-700"
                  onClick={() => setShowTerms(true)}
                  tabIndex={0}
                >
                  Syarat &amp; Ketentuan
                </button>
              </label>
            </div>
            <button
              className={`bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 sm:py-4 px-4 rounded-lg w-full ${
                !isChecked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="button"
              disabled={!isChecked}
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </div>
      </div>
      {showTerms && <TermsModal />}
    </div>
  );
}
