import React, { useEffect, useRef, useState, useCallback } from 'react';
import Template from '../../../../template/template';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../../components/breadcrumb/breadcrumb';
import Icon from '../../../../components/icons/icon';
import useCourseStore from '../../../../zustand/public/course/courseStore';
import StarRating from '../../../../components/content/star/star';
import DetailCourseCard, {
  MobileDetailCourseCard,
} from '../../../../components/card/detailCourseCard';
import OverviewCourseDetail from './section/overview';
import MaterialCourseDetail from './section/material';
import AttributeCourseDetail from './section/attribute';
import InstructorCourseDetail from './section/instructor';
import RatingCourseDetail from './section/rating';
import ReviewCourseDetail from './section/review';
import MoreCourse from './section/moreCourse';

const baseTabList = [
  { key: 'overview', label: 'Ringkasan' },
  { key: 'material', label: 'Materi Kursus' },
  // { key: 'attribute', label: 'Persyaratan & Deskripsi' },
  { key: 'instructor', label: 'Instruktur' },
  { key: 'rating', label: 'Rating' },
  { key: 'review', label: 'Ulasan' },
];

function ScrollTabs({ activeTab, setActiveTab, sectionRefs, attributeAvailable }) {
  // Build tab list dynamically
  const tabList = [
    ...baseTabList.slice(0, 2),
    ...(attributeAvailable ? [{ key: 'attribute', label: 'Persyaratan & Deskripsi' }] : []),
    ...baseTabList.slice(2),
  ];

  const yOffset = -200;
  const handleTabClick = (key) => {
    setActiveTab(key);
    if (sectionRefs[key] && sectionRefs[key].current) {
      const element = sectionRefs[key].current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 sm:gap-4 min-w-max">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-700 text-white'
                : 'bg-white text-primary-700 hover:bg-primary-200 border border-primary-700'
            }`}
            onClick={() => handleTabClick(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PublicCourse() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: '/kursus' },
    { label: 'Detail Kursus', path: location.pathname },
  ];
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { course, fetchCourseById, loading, error } = useCourseStore();
  function roundingValues(value) {
    const decimal = value - Math.floor(value);
    if (decimal < 0.5) {
      return Math.floor(value);
    } else if (decimal < 0.7) {
      return Math.floor(value);
    } else {
      return Math.ceil(value);
    }
  }
  const stickyParentRef = useRef(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  // Attribute availability state
  const [attributeAvailable, setAttributeAvailable] = useState(false);

  // Tabs state and section refs
  const [activeTab, setActiveTab] = useState('overview');
  const activeTabRef = useRef(activeTab);

  // Always declare all refs (never conditionally)
  const overviewRef = useRef(null);
  const materialRef = useRef(null);
  const attributeRef = useRef(null);
  const instructorRef = useRef(null);
  const ratingRef = useRef(null);
  const reviewRef = useRef(null);

  // Map section keys to refs
  const sectionRefs = {
    overview: overviewRef,
    material: materialRef,
    attribute: attributeRef,
    instructor: instructorRef,
    rating: ratingRef,
    review: reviewRef,
  };

  // Keep activeTabRef in sync with activeTab
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Fetch attribute availability
  const fetchAttributeAvailable = useCallback(async (id) => {
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'
        }/api/tanamin-courses/${id}/attribute`
      );
      const data = await res.json();
      // If attributes found, set true, else false
      if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
        setAttributeAvailable(true);
      } else {
        setAttributeAvailable(false);
      }
    } catch (e) {
      setAttributeAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
      fetchAttributeAvailable(courseId);
    }
  }, [courseId, fetchCourseById, fetchAttributeAvailable]);

  // Scroll handler for dynamic tabs
  useEffect(() => {
    const OFFSET = -205;
    const handleScroll = () => {
      // Build tab order dynamically
      const tabOrder = [
        'overview',
        'material',
        ...(attributeAvailable ? ['attribute'] : []),
        'instructor',
        'rating',
        'review',
      ];
      // Dapatkan posisi top setiap section relatif terhadap viewport
      const offsets = tabOrder.map((key) => {
        const ref = sectionRefs[key];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          return { key, top: rect.top };
        }
        return { key, top: Infinity };
      });

      // Cari section yang top-nya paling kecil tapi masih <= OFFSET (paling atas yang sudah lewat offset)
      const visibleSections = offsets.filter(({ top }) => top <= -OFFSET);

      let currentSection;
      if (visibleSections.length > 0) {
        // Ambil section terakhir yang sudah melewati OFFSET
        currentSection = visibleSections[visibleSections.length - 1];
      } else {
        // Jika belum ada yang melewati OFFSET, cari section terdekat ke OFFSET
        currentSection = offsets.reduce((prev, curr) =>
          Math.abs(curr.top - OFFSET) < Math.abs(prev.top - OFFSET) ? curr : prev
        );
      }

      if (currentSection && currentSection.key !== activeTabRef.current) {
        setActiveTab(currentSection.key);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [attributeAvailable]);

  return (
    <div className="mb-24 lg:mb-0">
      <Template
        activeNav="course.course"
        className="h-auto w-full bg-white mb-12 md:mb-0"
        locationKey={location.key}
      >
        <div className="relative w-full pb-20 lg:pb-0">
          {/* Sticky card desktop version */}
          <div
            ref={stickyParentRef}
            className="hidden lg:block w-1/4 xl:right-24 lg:right-16 md:right-10 absolute top-0 h-full items-start pointer-events-none z-30"
          >
            <div className="sticky top-16 pointer-events-auto hide-scrollbar overflow-y-auto max-h-[calc(100vh-36px)]">
              <div className="mt-6">
                <DetailCourseCard course={course} accessCourse={course?.access || false} />
              </div>
            </div>
          </div>

          {/* === Layer 1: Gradient Area === */}
          <div className="w-full bg-gradient-to-t from-primary-100 via-primary-100 to-white z-10">
            <div className="mx-auto flex flex-col lg:flex-row">
              <div className="w-full lg:w-3/4 xl:pl-24 lg:pl-16 md:pl-10 sm:pl-6 px-2 sm:px-4 pr-0 lg:pr-28 pt-8 pb-8 sm:pb-16">
                <Breadcrumb items={breadcrumbItems} />
                <div className="pt-8">
                  <button
                    className="flex items-center gap-2 bg-primary-700 text-white text-lg font-semibold px-6 py-2 rounded-full mb-4 hover:bg-primary-800"
                    onClick={() => navigate(-1)}
                  >
                    <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
                    <span>Kembali</span>
                  </button>
                  {course && (
                    <>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-medium">{course.title}</p>
                      <div className="flex flex-col gap-2 mt-6 sm:mt-8">
                        <div className="flex flex-wrap items-end gap-4 sm:gap-8">
                          <p className="flex items-start gap-2 text-secondary-700 text-base sm:text-lg">
                            <Icon
                              type="user-2"
                              className="w-5 h-5 inline-block"
                              color="currentColor"
                            />
                            {course?.students_count} Peserta
                          </p>
                          <div className="flex items-end gap-2">
                            <p className="text-base sm:text-lg text-primary-700 font-medium">
                              {course?.rating?.average}
                            </p>
                            <StarRating value={roundingValues(course?.rating?.average)} />
                          </div>
                          <p className="p-1 bg-white text-base sm:text-lg text-primary-700">
                            {course?.rating?.total} Rating
                          </p>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              navigate(`/instruktur/detail/${course.instructor.id}`);
                            }}
                            className="flex items-center gap-3"
                          >
                            <div className="border-2 border-primary-700 p-[4px] rounded-full aspect-square w-12 h-12 overflow-hidden flex items-center justify-center bg-white">
                              {course.instructor.photo_profile ? (
                                <img
                                  src={`${course.instructor.photo_profile}`}
                                  alt={`${course.instructor.name}`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <Icon type="user" className="w-8 h-8 text-gray-700" />
                              )}
                            </div>
                            <p className="text-lg sm:text-xl text-primary-700 font-bold">
                              {course.instructor.name}
                            </p>
                          </button>
                        </div>
                        <p className="flex items-center gap-2 text-base sm:text-lg font-medium mt-4 text-primary-700">
                          <Icon type={'date'} />
                          Terakhir diupdate pada {course?.updated_at}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="hidden lg:block w-1/4" />
            </div>
          </div>

          {/* === Layer 2: Area Putih === */}
          <div className="w-full bg-white z-0">
            <div className="mx-auto flex flex-col lg:flex-row mb-6">
              <div className="w-full lg:w-3/4 xl:pl-24 lg:pl-16 md:pl-10 sm:pl-6 px-2 sm:px-4 pr-0 lg:pr-28 pt-4 sm:pt-8 pb-4">
                {course && (
                  <div className="flex flex-col">
                    {/* Tabs */}
                    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg sticky top-[64px] z-20 mb-6">
                      <ScrollTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        sectionRefs={sectionRefs}
                        attributeAvailable={attributeAvailable}
                      />
                    </div>

                    {/* Gambar */}
                    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6">
                      <img className="w-full rounded-md mb-4" src={course.image} alt="" />
                    </div>

                    {/* Overview */}
                    <div ref={overviewRef}>
                      <OverviewCourseDetail course={course} />
                    </div>

                    {/* Material */}
                    <div ref={materialRef}>
                      <MaterialCourseDetail courseId={course.id} />
                    </div>

                    {/* Attribute */}
                    {attributeAvailable && (
                      <div ref={attributeRef}>
                        <AttributeCourseDetail courseId={course.id} />
                      </div>
                    )}

                    {/* Instruktur */}
                    <InstructorCourseDetail
                      course={course}
                      bioExpanded={bioExpanded}
                      setBioExpanded={setBioExpanded}
                      sectionRef={instructorRef}
                    />

                    {/* Rating */}
                    <RatingCourseDetail course={course} sectionRef={ratingRef} />

                    {/* Review */}
                    <ReviewCourseDetail course={course} sectionRef={reviewRef} maxHeight={350} />
                  </div>
                )}
              </div>
              <div className="hidden lg:block w-1/4" />
            </div>
          </div>

          {/* Sticky card mobile version */}
          {course && (
            <MobileDetailCourseCard course={course} accessCourse={course?.access || false} />
          )}

          {/* Loading dan Error */}
          {loading && <p className="text-center text-gray-500 py-8">Loading...</p>}
          {error && <p className="text-center text-red-500 py-8">{error}</p>}
        </div>

        {/* content white 2 */}
        <MoreCourse course={course} />
      </Template>
    </div>
  );
}
