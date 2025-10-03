import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import useProfileStore from '../../../zustand/profileStore';
import Icon from '../../../components/icons/icon';
import useCourseStore from '../../../zustand/public/course/courseStore';
import Card from '../../../components/card/card';
import UserProfileContent from '../profile/profile/profileContent';
import { useFilterCourseStore } from '../../../zustand/public/course/filterCourseStore';

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
  const navigate = useNavigate();
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

  // --- FILTER LOGIC ---
  const setCheckedInstructor = useFilterCourseStore((state) => state.setCheckedInstructor);
  const instructorList = useFilterCourseStore((state) => state.instructor);

  useEffect(() => {
    if (instructorId) {
      fetchUserProfileById(instructorId);
      fetchCoursesByInstructorId(instructorId);
    }
  }, [instructorId, fetchUserProfileById, fetchCoursesByInstructorId]);

  const photoCover = userProfile?.detail?.photo_cover;

  // Handler for "Lihat lainnya..." button
  const handleLihatLainnya = () => {
    // Cari nama instruktur dari daftar filter (karena filter by name, bukan id)
    let instructorName = null;
    if (Array.isArray(instructorList)) {
      const found = instructorList.find((ins) => String(ins.id) === String(instructorId));
      instructorName = found?.name;
    }
    if (instructorName) {
      // Set filter hanya pada instruktur ini
      const newChecked = {};
      instructorList.forEach((ins) => {
        newChecked[ins.name] = ins.name === instructorName;
      });
      // 'semua' harus false jika ada instruktur lain yang dipilih
      if (newChecked['semua'] !== undefined && instructorName !== 'semua') {
        newChecked['semua'] = false;
      }
      setCheckedInstructor(newChecked);
    }
    // Navigasi ke halaman kursus
    navigate('/kursus');
  };

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
        <div className="shadow-lg rounded-md mt-8 p-8">
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
          <div className="flex gap-8 mt-4 flex-wrap">
            {userProfile?.telephone ? (
              <a
                href={`https://wa.me/${userProfile?.telephone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 text-gray-500 items-center"
              >
                <Icon type={'phone'} className={'w-5 h-5'} />
                {userProfile?.telephone}
              </a>
            ) : null}
            {userProfile?.email ? (
              <a
                href={`mailto:${userProfile?.email}`}
                className="flex gap-2 text-gray-500 items-center"
              >
                <Icon type={'envelope'} className={'w-5 h-5'} />
                {userProfile?.email}
              </a>
            ) : null}
          </div>
        </div>

        {/* Kursus */}
        <div className="p-8">
          <div className="w-full flex justify-between border-b pb-2 border-gray-300 text-lg font-medium">
            <p>Kursus Lainnya dari {userProfile?.first_name}</p>
            <button
              className="flex items-center gap-2 text-primary-700 hover:underline transition-colors"
              onClick={handleLihatLainnya}
              type="button"
            >
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
