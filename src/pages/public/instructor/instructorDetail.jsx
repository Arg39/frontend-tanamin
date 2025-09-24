import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import useProfileStore from '../../../zustand/profileStore';
import Icon from '../../../components/icons/icon';
import useCourseStore from '../../../zustand/public/course/courseStore';
import Card from '../../../components/card/card';
import UserProfileContent from '../profile/content/profileContent';

// Custom hook for responsive breakpoint
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function InstructorDetailPublic() {
  const location = useLocation();
  const { instructorId } = useParams();
  const isMobile = useIsMobile(768);
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Instruktur', path: '/instruktur' },
    { label: 'Instruktur Detail', path: location.pathname },
  ];
  const { userProfile, userProfileLoading, userProfileError, fetchUserProfileById } =
    useProfileStore();

  // Course store
  const {
    instructorCourses,
    instructorCoursesLoading,
    instructorCoursesError,
    fetchCoursesByInstructorId,
  } = useCourseStore();

  useEffect(() => {
    if (instructorId) {
      fetchUserProfileById(instructorId);
      fetchCoursesByInstructorId(instructorId);
    }
  }, [instructorId, fetchUserProfileById, fetchCoursesByInstructorId]);

  const photoCover = userProfile?.detail?.photo_cover;

  return (
    <Template activeNav="course.Instruktur" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-2 pt-6 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Responsive Cover */}
        {isMobile ? (
          <>
            {/* Mobile: Cover photo on top */}
            {userProfileLoading ? (
              <div
                className="w-full rounded-lg bg-secondary-600 mb-4"
                style={{ aspectRatio: '3/1' }}
              />
            ) : userProfileError ? (
              <div className="text-red-500 p-6 mb-4">
                Gagal memuat data instruktur: {userProfileError}
              </div>
            ) : photoCover ? (
              <div
                className="w-full rounded-lg overflow-hidden mb-4"
                style={{ aspectRatio: '3/1' }}
              >
                <img
                  src={photoCover}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : null}

            {/* Profile Content after cover */}
            <UserProfileContent profile={userProfileLoading ? null : userProfile} isMobile={true} />
          </>
        ) : (
          <>
            {/* Desktop: Cover photo as background */}
            {userProfileLoading ? (
              <div
                className="w-full rounded-lg bg-secondary-600 relative"
                style={{ aspectRatio: '3/1' }}
              >
                <UserProfileContent profile={null} isMobile={false} />
              </div>
            ) : userProfileError ? (
              <div className="text-red-500 p-6">
                Gagal memuat data instruktur: {userProfileError}
              </div>
            ) : photoCover ? (
              <div
                className="w-full rounded-lg overflow-hidden relative"
                style={{ aspectRatio: '3/1' }}
              >
                <img
                  src={photoCover}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-lg"
                />
                <UserProfileContent profile={userProfile} isMobile={false} />
              </div>
            ) : (
              <div
                className="w-full rounded-lg bg-secondary-600 relative"
                style={{ aspectRatio: '3/1' }}
              >
                <UserProfileContent profile={userProfile} isMobile={false} />
              </div>
            )}
          </>
        )}

        {/* Biografi */}
        <div className="p-8">
          <p className="w-full border-b pb-2 border-gray-300 text-lg font-medium">Biografi</p>
          <p>{userProfile?.detail?.about || 'Belum ada biografi'}</p>
          <div className="flex gap-2 sm:gap-3 mt-6 flex-wrap">
            {Array.isArray(userProfile?.detail?.social_media) &&
              userProfile.detail.social_media.map((sm, idx) => (
                <a
                  key={idx}
                  href={sm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center w-12 h-12 rounded-full bg-gray-200 hover:bg-primary-700 hover:text-white transition"
                >
                  <Icon type={sm.type} className="w-6 h-6 sm:w-7 sm:h-7" />
                </a>
              ))}
          </div>
          <div className="flex gap-8 mt-8 flex-wrap">
            <a
              href={`https://wa.me/${userProfile?.telephone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 text-gray-500 items-center"
            >
              <Icon type={'phone'} className={'w-5 h-5'} />
              {userProfile?.telephone}
            </a>
            <a
              href={`mailto:${userProfile?.email}`}
              className="flex gap-2 text-gray-500 items-center"
            >
              <Icon type={'envelope'} className={'w-5 h-5'} />
              {userProfile?.email}
            </a>
          </div>
        </div>

        {/* Kursus */}
        <div className="p-8">
          <div className="w-full flex justify-between border-b pb-2 border-gray-300 text-lg font-medium">
            <p>Kursus Lainnya dari {userProfile?.first_name}</p>
            <button className="flex items-center gap-2 text-primary-700 hover:underline transition-colors">
              Lihat lainnya...
              <Icon type="arrow-right" className="w-4 h-4" />
            </button>
          </div>
          <div>
            {instructorCoursesLoading ? (
              <div className="text-gray-400 py-6">Memuat kursus...</div>
            ) : instructorCoursesError ? (
              <div className="text-red-500 py-6">Gagal memuat kursus: {instructorCoursesError}</div>
            ) : Array.isArray(instructorCourses) && instructorCourses.length > 0 ? (
              <Card course={instructorCourses} flexRow={true} />
            ) : (
              <div className="text-gray-400 py-6">Belum ada kursus yang dibuat instruktur ini.</div>
            )}
          </div>
        </div>
      </main>
    </Template>
  );
}
