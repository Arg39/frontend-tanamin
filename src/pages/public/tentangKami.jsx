import React, { useEffect } from 'react';
import Template from '../../template/template';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import GallerySwiper from '../../components/carousel/swiper';
import useAboutUsStore from '../../zustand/public/aboutUs/aboutUsStore';
import { motion, useInView, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { useRef, useState } from 'react';
import WysiwygContent from '../../components/content/wysiwyg/WysiwygContent';

// AnimatedCounter component
function AnimatedCounter({ to, start }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useAnimationFrame(() => {
    setDisplay(Math.floor(motionValue.get()));
  });

  useEffect(() => {
    let controls;
    if (start) {
      controls = animate(motionValue, to, { duration: 5, ease: 'easeOut' });
    } else {
      motionValue.set(0);
      setDisplay(0);
    }
    return () => controls && controls.stop();
    // eslint-disable-next-line
  }, [to, start]);

  return <span>{display}</span>;
}

export default function TentangKami() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Tentang Kami', path: location.pathname },
  ];

  const {
    aboutUs,
    loading,
    error,
    fetchAboutUs,
    activitiesImages,
    loadingActivities,
    errorActivities,
    fetchActivitiesImages,
    partnerships,
    loadingPartnerships,
    errorPartnerships,
    fetchPartnerships,
    fetchedActivities,
    fetchedPartnerships,
  } = useAboutUsStore();

  useEffect(() => {
    if (!aboutUs && !loading) fetchAboutUs();
    // eslint-disable-next-line
  }, [aboutUs, loading, fetchAboutUs]);

  useEffect(() => {
    if (!fetchedActivities && !loadingActivities) {
      fetchActivitiesImages();
    }
    // eslint-disable-next-line
  }, [fetchedActivities, loadingActivities, fetchActivitiesImages]);

  useEffect(() => {
    if (!fetchedPartnerships && !loadingPartnerships) {
      fetchPartnerships();
    }
    // eslint-disable-next-line
  }, [fetchedPartnerships, loadingPartnerships, fetchPartnerships]);

  // Ref for statistics section
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: '-100px' });

  return (
    <Template activeNav="tentang-kami" locationKey={location.key}>
      <main className="w-full bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8">
        <Breadcrumb items={breadcrumbItems} />
        <section className="flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between gap-8 py-8">
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-4">
              PT Tanamin Bumi Nusantara
            </h1>
            <blockquote className="text-base sm:text-lg md:text-xl text-secondary-950 mt-4 border-l-4 border-primary-500 pl-4 italic">
              {aboutUs?.vision}
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
          {loading && <p>Memuat data...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {aboutUs && <WysiwygContent html={aboutUs?.about} />}
        </section>

        <section className="w-full mt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-gray-50 rounded-xl p-6 md:p-10 shadow-sm">
            <div className="flex-1 flex flex-col gap-8 w-full">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-2">Visi Kami</h2>
                <p className="text-base md:text-lg text-secondary-950">{aboutUs?.vision}</p>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-2">Misi Kami</h2>
                <ul className="list-disc pl-5 space-y-3 text-base md:text-lg text-secondary-950">
                  {aboutUs?.mission && aboutUs.mission.length > 0
                    ? aboutUs.mission.map((misi, idx) => <li key={idx}>{misi}</li>)
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full mt-8 mb-8">
          <div
            ref={statsRef}
            className="w-full flex flex-col md:flex-row items-center md:items-start gap-8 bg-gray-50 rounded-xl p-6 md:p-10 shadow-sm"
          >
            <div>
              {/* Statistik */}
              <h2 className="text-xl md:text-2xl font-bold text-primary-700 mb-2">Statistik</h2>
              <ul className="list-disc space-y-3 mb-4 text-base md:text-lg text-secondary-950">
                Adapun beberapa statistik keberhasilan yang kami miliki adalah sebagai berikut:
              </ul>
              {aboutUs?.statistics && aboutUs.statistics.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center items-center">
                  {aboutUs.statistics.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between bg-white rounded-lg shadow-md px-6 py-4 min-w-[120px] w-full h-40" // fixed card height
                    >
                      <span
                        className="block text-2xl md:text-lg font-bold text-secondary-900 mb-2 h-24 md:h-12 overflow-hidden text-ellipsis whitespace-normal" // fixed title height
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={stat.title}
                      >
                        {stat.title} :
                      </span>
                      <div className="flex flex-row items-end gap-2 mt-auto">
                        <span className="text-2xl md:text-5xl font-bold text-primary-700">
                          <AnimatedCounter to={stat.value} start={isInView} />
                        </span>
                        <span className="text-base md:text-lg text-secondary-900 font-medium capitalize">
                          {stat.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Swiper Marquee Section */}
        {(loadingActivities ||
          errorActivities ||
          (activitiesImages.length > 0 && fetchedActivities)) && (
          <section className="w-full mb-16 px-0 relative">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-6">
              Galeri kegiatan Tanamin
            </h2>
            <div className="w-full">
              {loadingActivities && <p>Memuat galeri kegiatan...</p>}
              {errorActivities && <p className="text-red-600">{errorActivities}</p>}
              {!loadingActivities && !errorActivities && activitiesImages.length > 0 && (
                <GallerySwiper images={activitiesImages} />
              )}
              {!loadingActivities &&
                !errorActivities &&
                activitiesImages.length === 0 &&
                fetchedActivities && (
                  <p className="text-gray-500 text-center">Belum ada gambar kegiatan.</p>
                )}
            </div>
          </section>
        )}

        {(loadingPartnerships ||
          errorPartnerships ||
          (partnerships.length > 0 && fetchedPartnerships)) && (
          <section className="w-full mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-6">
              Kerja Sama Kami
            </h2>
            <div className="w-full flex flex-wrap justify-center gap-8">
              {loadingPartnerships && <p>Memuat data mitra...</p>}
              {errorPartnerships && <p className="text-red-600">{errorPartnerships}</p>}
              {!loadingPartnerships &&
                !errorPartnerships &&
                partnerships.length === 0 &&
                fetchedPartnerships && (
                  <p className="text-gray-500 text-center">Belum ada data mitra.</p>
                )}
              {!loadingPartnerships &&
                !errorPartnerships &&
                partnerships.length > 0 &&
                partnerships.map((mitra, idx) => {
                  const PartnerContent = (
                    <>
                      {mitra.logo && (
                        <img
                          src={mitra.logo}
                          alt={mitra.name}
                          className="h-16 w-auto object-contain mb-3"
                          loading="lazy"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-primary-700 mb-1 text-center">
                        {mitra.name}
                      </h3>
                      {mitra.description && (
                        <p className="text-sm text-secondary-900 text-center">
                          {mitra.description}
                        </p>
                      )}
                    </>
                  );
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center bg-white rounded-lg shadow-md px-6 py-4 w-64"
                    >
                      {mitra.website ? (
                        <a
                          href={mitra.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center w-full"
                          title={mitra.website}
                        >
                          {PartnerContent}
                        </a>
                      ) : (
                        PartnerContent
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </main>
    </Template>
  );
}
