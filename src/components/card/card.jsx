import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icons/icon';
import { motion } from 'framer-motion';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function getPriceDisplay(price, discount, type_discount) {
  if (typeof price !== 'number' || isNaN(price)) {
    return <span className="text-base sm:text-lg font-bold text-gray-400">Tidak tersedia</span>;
  }

  if (price <= 0) {
    return <span className="text-base sm:text-lg font-bold text-green-600">Gratis</span>;
  }

  if (!discount || !type_discount) {
    return (
      <p className="text-base sm:text-lg font-bold text-primary-700">
        Rp {price.toLocaleString('id-ID')}
      </p>
    );
  }

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

  return (
    <p className="text-base sm:text-lg font-bold text-primary-700">
      Rp {price.toLocaleString('id-ID')}
    </p>
  );
}

export default function Card({
  course,
  content = 'true',
  maxWidth,
  flexRow,
  cardHeight,
  disableLink,
  disableShadow = false, // NEW PROP
}) {
  const isMobile = useIsMobile();

  if (Array.isArray(course)) {
    if (flexRow) {
      return (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
          {course.map((item) => (
            <div
              key={item.id}
              style={{
                minWidth: isMobile ? '12rem' : maxWidth ? `${maxWidth}rem` : '18rem',
                maxWidth: isMobile ? '14rem' : maxWidth ? `${maxWidth}rem` : '22rem',
                flex: '0 0 auto',
              }}
            >
              <Card course={item} content={content} maxWidth={maxWidth} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {course.map((item) => (
          <Card key={item.id} course={item} content={content} />
        ))}
      </div>
    );
  }

  if (!course) return null;

  const cardStyle = maxWidth
    ? {
        maxWidth: `${maxWidth}rem`, // Always use provided maxWidth
        minWidth: `${maxWidth}rem`, // Always use provided minWidth
        width: '100%',
        minHeight: cardHeight ? `${cardHeight}px` : undefined,
      }
    : cardHeight
    ? { minHeight: `${cardHeight}px`, width: '100%' }
    : {};

  // If disableLink is true, render as a div instead of Link
  const CardContent = (
    <motion.div
      className={`w-full bg-white rounded-xl ${
        disableShadow ? '' : 'shadow-md'
      } p-3 sm:p-4 flex flex-col h-full cursor-pointer`}
      style={cardHeight ? { minHeight: `${cardHeight}px` } : {}}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      }}
      whileTap={{ scale: 0.98 }}
    >
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

            {/* Rating */}
            <div className="w-full mt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      key={index}
                      type={'star'}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        index < Math.round(course.average_rating || 0)
                          ? 'text-tertiary-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <p className="ml-2 text-xs sm:text-sm text-gray-600">
                    ({course.total_rating || 0})
                  </p>
                </div>
              </div>

              {/* Judul */}
              <h2 className="mt-2 font-medium text-sm sm:text-base line-clamp-3">{course.title}</h2>

              {/* Info */}
              <div className="mt-3 flex flex-wrap justify-between gap-y-1 text-gray-600 text-xs sm:text-sm">
                <div className="flex items-center gap-1 min-w-[48%]">
                  <Icon type="book" className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{course.total_material || 0} Materi</span>
                </div>
                <div className="flex items-center gap-1 min-w-[48%] justify-end sm:justify-start">
                  <Icon type="clipboard" className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{course.total_quiz || 0} Evaluasi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor & Harga */}
          <div className="mt-4">
            <p className="text-sm sm:text-base font-medium text-gray-700">
              {course.instructor || '-'}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2">
              {getPriceDisplay(
                course.price ?? 0,
                course.discount ?? 0,
                course.type_discount ?? null
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (disableLink) {
    return <div style={{ ...cardStyle, width: '100%' }}>{CardContent}</div>;
  }

  return (
    <Link
      to={`/kursus/${course.id}`}
      className="w-full"
      style={{ textDecoration: 'none', color: 'inherit', ...cardStyle }}
    >
      {CardContent}
    </Link>
  );
}
