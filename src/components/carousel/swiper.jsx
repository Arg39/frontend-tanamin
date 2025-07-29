import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function GallerySwiper({ images }) {
  // If less than 6 images, show static images in a flex container
  if (images.length < 6) {
    return (
      <div className="w-full flex flex-wrap gap-8 justify-center items-center">
        {images.map((img, idx) => (
          <div
            key={`static-${idx}`}
            style={{
              width: '320px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-64 object-cover rounded-xl shadow-lg"
              loading="lazy"
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>
    );
  }

  // If 6 or more images, show Swiper
  const extendedImages = [...images, ...images];

  return (
    <div className="gap-4">
      {/* gerak ke kiri */}
      <div>
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={32}
          loop={true}
          loopedSlides={images.length}
          autoplay={{
            delay: 1, // autoplay berjalan terus
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={6000} // gerakan smooth
          dir="ltr"
          className="w-full"
          style={{ width: '100vw' }}
        >
          {extendedImages.map((img, idx) => (
            <SwiperSlide
              key={`slide-${idx}`}
              style={{
                width: '320px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                loading="lazy"
                style={{ width: '100%' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* gerak ke kanan */}
      <div className="mt-12">
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={32}
          loop={true}
          loopedSlides={images.length}
          autoplay={{
            delay: 1, // autoplay berjalan terus
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={6000} // gerakan smooth
          dir="rtl"
          className="w-full"
          style={{ width: '100vw' }}
        >
          {extendedImages.map((img, idx) => (
            <SwiperSlide
              key={`slide-${idx}`}
              style={{
                width: '320px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                loading="lazy"
                style={{ width: '100%' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
