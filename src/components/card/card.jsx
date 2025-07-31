import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icons/icon';

function getPriceDisplay(price, discount, type_discount) {
  // Jika harga 0 atau kurang, tampilkan Gratis
  if (price <= 0) {
    return <span className="text-base sm:text-lg font-bold text-green-600">Gratis</span>;
  }
  // Tidak ada diskon
  if (!discount || !type_discount) {
    return (
      <p className="text-base sm:text-lg font-bold text-primary-700">
        Rp {price.toLocaleString('id-ID')}
      </p>
    );
  }
  // Diskon persentase
  if (type_discount === 'percent') {
    const percent = discount / 100;
    const discountedPrice = Math.round(price * (1 - percent));
    if (discountedPrice <= 0) {
      return <span className="text-base sm:text-lg font-bold text-green-600">Gratis</span>;
    }
    return (
      <>
        <p className="text-base sm:text-lg font-bold text-primary-700">
          Rp {discountedPrice.toLocaleString('id-ID')}
        </p>
        <p className="text-sm sm:text-base text-gray-400 line-through">
          Rp {price.toLocaleString('id-ID')}
        </p>
        <span className="text-xs sm:text-sm text-green-600 font-semibold ml-1">
          {discount}% OFF
        </span>
      </>
    );
  }
  // Diskon nominal
  if (type_discount === 'nominal') {
    const discountedPrice = price - discount;
    if (discountedPrice <= 0) {
      return <span className="text-base sm:text-lg font-bold text-green-600">Gratis</span>;
    }
    return (
      <>
        <p className="text-base sm:text-lg font-bold text-primary-700">
          Rp {discountedPrice.toLocaleString('id-ID')}
        </p>
        <p className="text-sm sm:text-base text-gray-400 line-through">
          Rp {price.toLocaleString('id-ID')}
        </p>
        <span className="text-xs sm:text-sm text-green-600 font-semibold ml-1">
          -Rp {discount.toLocaleString('id-ID')}
        </span>
      </>
    );
  }
  // fallback
  return (
    <p className="text-base sm:text-lg font-bold text-primary-700">
      Rp {price.toLocaleString('id-ID')}
    </p>
  );
}

export default function Card({ course, content = 'true' }) {
  return (
    <Link
      to={`/kursus/${course.id}`}
      className="w-full"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col h-full lg:min-h-[420px] cursor-pointer">
        {content && (
          <div className="flex flex-col justify-between h-full flex-grow">
            {/* Gambar */}
            <div>
              <div className="w-full aspect-video relative overflow-hidden rounded-md">
                <img
                  src={course.image}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Rating & Bookmark */}
              <div className="w-full mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Icon
                        key={index}
                        type={'star'}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          index < course.average_rating ? 'text-tertiary-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <p className="ml-2 text-xs sm:text-sm text-gray-600">({course.total_rating})</p>
                  </div>
                </div>

                {/* Judul */}
                <h2 className="mt-2 font-medium text-sm sm:text-base line-clamp-3">
                  {course.title}
                </h2>

                {/* Info materi dan evaluasi */}
                <div className="mt-3 flex flex-wrap justify-between gap-y-1 text-gray-600 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 min-w-[48%]">
                    <Icon type="book" className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{course.total_material} Materi</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-[48%] justify-end sm:justify-start">
                    <Icon type="clipboard" className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{course.total_quiz} Evaluasi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor & Harga */}
            <div className="mt-4">
              <p className="text-sm sm:text-base font-medium text-gray-700">{course.instructor}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2">
                {getPriceDisplay(course.price, course.discount, course.type_discount)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
