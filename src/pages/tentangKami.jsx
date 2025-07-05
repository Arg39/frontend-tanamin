import React, { useState, useRef, useEffect, useCallback } from 'react';
import Template from '../template/template';
import Breadcrumb from '../components/breadcrumb/breadcrumb2';
import { useLocation } from 'react-router-dom';
import { motion, useAnimationFrame } from 'framer-motion';

function ImageCarousel({ images, interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [drag, setDrag] = useState({ isDragging: false, startX: null, diff: 0 });
  const currentRef = useRef(current);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    if (!hovered && !drag.isDragging) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, interval);
      return () => clearInterval(timer);
    }
  }, [hovered, drag.isDragging, images.length, interval]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleTouchStart = (e) => {
    setDrag({ isDragging: true, startX: e.touches[0].clientX, diff: 0 });
  };
  const handleTouchMove = (e) => {
    if (!drag.isDragging) return;
    setDrag((d) => ({ ...d, diff: e.touches[0].clientX - d.startX }));
  };
  const handleTouchEnd = () => {
    if (drag.diff > 50) prevSlide();
    else if (drag.diff < -50) nextSlide();
    setDrag({ isDragging: false, startX: null, diff: 0 });
  };

  const handleMouseDown = (e) => {
    setDrag({ isDragging: true, startX: e.clientX, diff: 0 });
  };
  const handleMouseMove = (e) => {
    if (!drag.isDragging) return;
    setDrag((d) => ({ ...d, diff: e.clientX - d.startX }));
  };
  const handleMouseUp = () => {
    if (!drag.isDragging) return;
    if (drag.diff > 50) prevSlide();
    else if (drag.diff < -50) nextSlide();
    setDrag({ isDragging: false, startX: null, diff: 0 });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  return (
    <div
      className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex-shrink-0 flex items-center justify-center transition-all duration-300 group select-none"
      tabIndex={0}
      role="region"
      aria-label="Image Carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      style={{ cursor: drag.isDragging ? 'grabbing' : 'grab', outline: 'none' }}
    >
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-xl shadow-lg transition-all duration-500 ease-in-out"
        loading="lazy"
        draggable={false}
        style={{ userSelect: 'none', pointerEvents: drag.isDragging ? 'none' : 'auto' }}
      />
      {hovered && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white-100 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Sebelumnya"
            type="button"
          >
            <span className="text-2xl font-bold">{'<'}</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white-100 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
            aria-label="Selanjutnya"
            type="button"
          >
            <span className="text-2xl font-bold">{'>'}</span>
          </button>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              idx === current ? 'bg-primary-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            tabIndex={-1}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

function MitraSlider({ items, interval = 2500 }) {
  // Responsif: 2 di mobile, 3 di tablet, 4 di desktop
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const getVisible = () => {
    if (windowWidth < 640) return 2;
    if (windowWidth < 1024) return 3;
    return 4;
  };
  const visible = getVisible();

  // Infinite loop state
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef();

  // Duplicate items for infinite effect
  const extendedItems = [...items, ...items, ...items];

  useEffect(() => {
    if (items.length <= visible) return;
    const timer = setInterval(() => {
      setIsAnimating(true);
      setIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, visible, interval]);

  // Reset animation when reach the end of the middle set
  useEffect(() => {
    if (index === items.length * 2) {
      // Disable animation, jump to middle set
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(items.length);
      }, 300); // match transition duration
    }
  }, [index, items.length]);

  // Initial index at the middle set
  useEffect(() => {
    setIndex(items.length);
  }, [items.length]);

  // Calculate translateX
  const slideWidth = 144; // w-32 + gap (128px + 16px), adjust if needed
  const translateX = -(index * slideWidth);

  return (
    <div className="w-full overflow-hidden flex justify-center">
      <div
        ref={sliderRef}
        className="flex gap-4"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isAnimating ? 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' : 'none',
          width: `${extendedItems.length * slideWidth}px`,
        }}
      >
        {extendedItems.map((mitra, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={mitra.logo}
              alt={mitra.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TentangKami() {
  const location = useLocation();

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Tentang Kami', path: location.pathname },
  ];

  const carouselImages = [
    {
      src: 'https://images.unsplash.com/photo-1750173588085-895136c6e0a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Ilustrasi Visi Tanamin 1',
    },
    {
      src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
      alt: 'Ilustrasi Visi Tanamin 2',
    },
    {
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      alt: 'Ilustrasi Visi Tanamin 3',
    },
  ];

  const mitraList = [
    {
      name: 'Mitra A',
      logo: 'https://logowik.com/content/uploads/images/pertamina2579.jpg',
    },
    {
      name: 'Mitra B',
      logo: 'https://cyberkatulistiwa.com/wp-content/uploads/2019/07/IMG-20190708-WA0089.jpg',
    },
    // tambahkan mitra lain di sini
  ];

  return (
    <Template activeNav="tentang-kami" locationKey={location.key}>
      <main className=" bg-white-100 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8">
        <Breadcrumb items={breadcrumbItems} />
        <section className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-8 py-8">
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-4">
              PT Tanamin Bumi Nusantara
            </h1>
            <blockquote className="text-base sm:text-lg md:text-xl text-secondary-950 mt-4 border-l-4 border-primary-500 pl-4 italic">
              “Mewujudkan lingkungan yang lestari dan berkelanjutan melalui konservasi alam,
              penanaman pohon, serta memberdayakan masyarakat untuk masa depan bumi yang lebih
              hijau.”
            </blockquote>
          </div>
          <figure className="flex-shrink-0 flex justify-center items-center w-full lg:w-auto mb-8 lg:mb-0">
            <img
              src="/assets/logo.png"
              alt="Logo PT Tanamin Bumi Nusantara"
              className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto object-contain drop-shadow-lg"
              loading="lazy"
            />
          </figure>
        </section>
        <section className="w-full mt-2 md:mt-6 bg-gray-50 rounded-xl p-4 md:p-8 shadow-sm">
          <p className="text-justify text-base md:text-lg leading-relaxed">
            PT Tanamin Bumi Nusantara didirikan pada <strong>25 November 2024</strong> sebagai
            bentuk komitmen nyata dalam pengelolaan Tanggung Jawab Sosial Perusahaan (TJSP) atau
            dana Corporate Social Responsibility (CSR) yang berfokus pada
            <span className="font-semibold text-primary-700"> pelestarian lingkungan</span> dan
            <span className="font-semibold text-primary-700"> pengembangan masyarakat</span>.
          </p>
          <p className="text-justify text-base md:text-lg leading-relaxed mt-4">
            Kami hadir sebagai perusahaan yang mengintegrasikan teknologi dalam setiap aspek
            pelestarian lingkungan, mulai dari pengumpulan data, pemantauan lapangan, hingga
            pelaporan yang transparan dan akuntabel. Selain itu, kami juga berperan sebagai
            konsultan teknologi, mendampingi mitra CSR agar solusi digital yang digunakan dapat
            diimplementasikan secara efektif dan berdampak jangka panjang.
          </p>
        </section>

        <section className="w-full mt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-gray-50 rounded-xl p-6 md:p-10 shadow-sm">
            {/* Carousel Start */}
            <ImageCarousel images={carouselImages} interval={4000} />
            <div className="flex-1 flex flex-col gap-8 w-full">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-2">Visi Kami</h2>
                <p className="text-base md:text-lg text-secondary-950">
                  Mewujudkan lingkungan yang lestari dan berkelanjutan melalui konservasi alam,
                  penanaman pohon, serta memberdayakan masyarakat.
                </p>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-2">Misi Kami</h2>
                <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-secondary-950">
                  <li>
                    <span className="font-semibold text-primary-600">Lingkungan:</span> Melakukan
                    konservasi hutan dan penanaman pohon secara masif untuk mengurangi deforestasi.
                  </li>
                  <li>
                    <span className="font-semibold text-primary-600">Penggalangan Dana CSR:</span>{' '}
                    Menghimpun dan menyalurkan dana CSR dengan transparan dan berdampak nyata.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-6">
            Kerja Sama Kami
          </h2>
          <MitraSlider items={mitraList} interval={2500} />
        </section>
      </main>
    </Template>
  );
}
