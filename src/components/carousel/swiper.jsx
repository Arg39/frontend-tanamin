import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// refs for both swipers (move outside conditional)
export default function GallerySwiper({ images }) {
  const swiperRefLtr = useRef(null);
  const swiperRefRtl = useRef(null);

  // function to start autoplay on mount
  const handleSwiperInit = (swiper, ref) => {
    ref.current = swiper;
    if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
      swiper.autoplay.start();
    }
  };

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
            delay: 0, // autoplay langsung jalan
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={6000} // gerakan smooth
          dir="ltr"
          className="w-full"
          style={{ width: '100%' }}
          onSwiper={(swiper) => handleSwiperInit(swiper, swiperRefLtr)}
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
            delay: 0, // autoplay langsung jalan
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={6000} // gerakan smooth
          dir="rtl"
          className="w-full"
          style={{ width: '100%' }}
          onSwiper={(swiper) => handleSwiperInit(swiper, swiperRefRtl)}
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
