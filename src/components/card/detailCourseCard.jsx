import React from 'react';
import { formatRupiah } from '../../utils/formatRupiah';
import Icon from '../icons/icon';
import useAuthStore from '../../zustand/authStore';
import { useNavigate } from 'react-router-dom';

function translateLevel(level) {
  switch (level) {
    case 'beginner':
      return 'Pemula';
    case 'intermediate':
      return 'Menengah';
    case 'advance':
      return 'Lanjutan';
    default:
      return level;
  }
}

function getDiscountedPrice(price, discount) {
  if (!discount) return price;
  if (discount.type === 'percent') {
    return price - Math.round((discount.value / 100) * price);
  }
  if (discount.type === 'nominal') {
    return price - discount.value;
  }
  return price;
}

export default function DetailCourseCard({ course, accessCourse }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  if (!course) return null;

  const hasDiscount =
    course.discount && (course.discount.type === 'percent' || course.discount.type === 'nominal');
  const discountedPrice = hasDiscount
    ? getDiscountedPrice(course.price, course.discount)
    : course.price;

  return (
    <div className="bg-white border-4 border-primary-700 shadow-lg rounded-xl p-4 sm:p-6 w-full mb-4">
      <img className="w-full rounded-xl" src={course.image} alt={course.title} />
      {accessCourse ? (
        <button className="w-full my-2 py-2 flex gap-2 items-center justify-center bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
          <Icon type="play" className="w-5 h-5" />
          Mulai Belajar
        </button>
      ) : user ? (
        <>
          <div className="w-full py-4 flex items-center justify-center">
            {hasDiscount ? (
              <div className="flex flex-col items-center">
                <div className="relative flex items-start gap-2">
                  <span className="text-xl sm:text-2xl font-medium text-tertiary-500">
                    {formatRupiah(discountedPrice)}
                  </span>
                  <span className="text-xs text-secondary-500 line-through">
                    {formatRupiah(course.price)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xl sm:text-2xl font-medium text-tertiary-500">
                {formatRupiah(course.price)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <button className="w-full py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
              Tambahkan Ke Keranjang
            </button>
            <button className="w-full py-2 border-2 border-primary-700 bg-white text-primary-700 rounded-lg hover:bg-primary-800 hover:text-white text-base transition-colors">
              Beli Sekarang
            </button>
          </div>
        </>
      ) : (
        <div className="w-full py-4 flex items-center justify-center">
          <button
            onClick={() => navigate('/masuk')}
            className="w-full py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors"
          >
            Login untuk mengakses kursus
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-primary-700 font-semibold">Detail</p>
        <div className="flex flex-col gap-2 mt-2">
          {[
            ['Peserta', course.participants],
            ['Level', translateLevel(course.level)],
            ['Total Materi', course.total_materials],
            ['Evaluasi', course.total_quizzes],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center border-b-2 border-secondary-500 pb-1 mb-2"
            >
              <p className="text-secondary-700 font-medium">{label}</p>
              <p className="p-1 px-2 bg-secondary-500 text-white rounded-lg">{value}</p>
            </div>
          ))}
        </div>
      </div>
      {!accessCourse && user ? (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-primary-700 font-semibold">Kupon Kursus</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              className="w-full border-2 border-primary-700 text-primary-700 rounded-lg p-2 flex-1"
              placeholder="Masukkan kupon"
            />
            <button className="w-full bg-primary-700 text-white rounded-lg px-4 py-2 sm:w-auto">
              Masukkan
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MobileDetailCourseCard({ course, accessCourse }) {
  const [expanded, setExpanded] = React.useState(false);
  const { user } = useAuthStore();

  if (!course) return null;

  const hasDiscount =
    course.discount && (course.discount.type === 'percent' || course.discount.type === 'nominal');
  const discountedPrice = hasDiscount
    ? getDiscountedPrice(course.price, course.discount)
    : course.price;

  return (
    <>
      {/* Overlay expanded card */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end lg:hidden">
          <div
            className="w-full bg-white rounded-t-2xl shadow-lg animate-slide-up flex flex-col"
            style={{
              maxHeight: '75vh',
              marginTop: '60px',
            }}
          >
            {/* Header tetap di atas */}
            <div className="flex-shrink-0 flex justify-between items-center px-4 pt-4 pb-2 border-b bg-white rounded-t-2xl z-10">
              <span className="text-lg font-semibold text-primary-700">Detail Kursus</span>
              <button
                className="text-gray-500 text-2xl font-bold px-2"
                onClick={() => setExpanded(false)}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            {/* Konten scrollable */}
            <div className="overflow-y-auto flex-1 p-4">
              <img src={course.image} alt={course.title} className="w-full rounded-xl mb-4" />
              <div className="mb-2">
                <span className="text-xl font-semibold text-primary-700">{course.title}</span>
              </div>
              {accessCourse ? (
                <button className="w-full my-2 mb-6 py-2 flex gap-2 items-center justify-center bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
                  <Icon type="play" className="w-5 h-5" />
                  Mulai Belajar
                </button>
              ) : user ? (
                <>
                  <div className="w-full py-4 flex items-center justify-center">
                    {hasDiscount ? (
                      <div className="flex flex-col items-center">
                        <div className="relative flex items-start gap-2">
                          <span className="text-xl sm:text-3xl font-medium text-tertiary-500">
                            {formatRupiah(discountedPrice)}
                          </span>
                          <span className="text-xs text-secondary-500 line-through">
                            {formatRupiah(course.price)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xl sm:text-2xl font-medium text-tertiary-500">
                        {formatRupiah(course.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <button className="w-full py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
                      Tambahkan Ke Keranjang
                    </button>
                    <button className="w-full py-2 border-2 border-primary-700 bg-white text-primary-700 rounded-lg hover:bg-primary-800 hover:text-white text-base transition-colors">
                      Beli Sekarang
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full py-4 flex items-center justify-center">
                  <button className="w-full py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-base transition-colors">
                    Login untuk mengakses kursus
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-primary-700 font-semibold">Detail</p>
                <div className="flex flex-col gap-2">
                  {[
                    ['Peserta', course.participants],
                    ['Level', translateLevel(course.level)],
                    ['Total Materi', course.total_materials],
                    ['Evaluasi', course.total_quizzes],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center border-b-2 border-secondary-500 pb-1 mb-2"
                    >
                      <p className="text-secondary-700 font-medium">{label}</p>
                      <p className="p-1 px-2 bg-secondary-500 text-white rounded-lg">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {!accessCourse && user ? (
                <div className="flex flex-col gap-2 mt-4">
                  <p className="text-primary-700 font-semibold">Kupon Kursus</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      className="w-full border-2 border-primary-700 text-primary-700 rounded-lg p-2 flex-1"
                      placeholder="Masukkan kupon"
                    />
                    <button className="w-full bg-primary-700 text-white rounded-lg px-4 py-2 sm:w-auto">
                      Masukkan
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden bg-white border-t border-gray-200 shadow-[0_-2px_16px_0_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className={`flex items-center gap-3 min-w-0 ${!user ? 'flex-1' : ''}`}>
            <button
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-primary-700 border border-primary-200 hover:bg-primary-50 transition"
              style={{ aspectRatio: 1 }}
              onClick={() => setExpanded(true)}
              aria-label="Lihat detail"
            >
              <Icon type="chevron-top" className="w-4 h-4" color="currentColor" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold text-primary-700 truncate">
                {course.title}
              </span>
              {!accessCourse && user ? (
                <>
                  {hasDiscount ? (
                    <span className="flex items-center gap-2">
                      <span className="text-sm text-tertiary-500 font-medium">
                        {formatRupiah(discountedPrice)}
                      </span>
                      <span className="text-xs text-tertiary-400 line-through">
                        {formatRupiah(course.price)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-tertiary-500 font-medium">
                      {formatRupiah(course.price)}
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>
          {user || accessCourse ? (
            <div className="flex flex-col gap-2 min-w-[110px]">
              {accessCourse ? (
                <button className="w-fit flex items-center gap-2 py-1 px-2 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
                  <Icon type="play" className="w-5 h-5" />
                  Mulai Belajar
                </button>
              ) : user ? (
                <>
                  <button className="w-full py-1 px-3 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
                    Keranjang
                  </button>
                  <button className="w-full py-1 px-3 border-2 border-primary-700 bg-white text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-800 hover:text-white transition-colors">
                    Beli
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col gap-2 min-w-[110px]">
            {accessCourse ? (
              <button className="w-fit flex items-center gap-2 py-1 px-2 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
                <Icon type="play" className="w-5 h-5" />
                Mulai Belajar
              </button>
            ) : user ? (
              <>
                <button className="w-full py-1 px-3 bg-primary-700 text-white rounded-lg text-sm font-semibold hover:bg-primary-800 transition-colors">
                  Keranjang
                </button>
                <button className="w-full py-1 px-3 border-2 border-primary-700 bg-white text-primary-700 rounded-lg text-sm font-semibold hover:bg-primary-800 hover:text-white transition-colors">
                  Beli
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {/* Animasi slide-up */}
      <style>
        {`
            @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slide-up {
              animation: slide-up 0.25s cubic-bezier(0.4,0,0.2,1);
            }
          `}
      </style>
    </>
  );
}
