import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import CourseRingkasan from './tabs/ringkasan/ringkasan';
import CourseAttribute from './tabs/atribut/atribut';
import CourseMateri from './tabs/materi/materi';
import useNavigationStore from '../../../zustand/navigationStore';
import useAuthStore from '../../../zustand/authStore';
import UlasanCourse from './tabs/ulasan/ulasan';
import Siswa from './tabs/siswa/siswa';

const tabComponents = {
  informasiUtama: CourseRingkasan,
  atribut: CourseAttribute,
  materi: CourseMateri,
  ulasan: UlasanCourse,
  siswa: Siswa,
};

export default function CuourseDetail({ editable }) {
  const role = useAuthStore((state) => state.user.role);
  const navigate = useNavigate();
  const { id, tab } = useParams();
  const activeTab = tab || 'ringkasan';
  const tabs = useNavigationStore((state) => state.courseDetailTabs);

  const handleTabChange = (tabName) => {
    if (role === 'admin') {
      navigate(`/admin/kursus/${id}/lihat/${tabName}`);
    } else if (role === 'instructor') {
      navigate(`/instruktur/kursus/${id}/lihat/${tabName}`);
    }
  };

  const ActiveComponent = tabComponents[activeTab] || CourseRingkasan;

  return (
    <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
      <div>
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => {
            if (role === 'admin') {
              navigate('/admin/kursus');
            } else if (role === 'instructor') {
              navigate('/instruktur/kursus');
            }
          }}
        >
          <Icon type="arrow-left" className="size-[1rem] text-white" />
          <span className="text-white">Kembali</span>
        </button>
        <h4 className="text-lg sm:text-2xl font-bold">Detail Kursus</h4>
      </div>
      <div className="flex flex-nowrap overflow-x-auto gap-2 p-2 sm:pb-0">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            className={`flex-shrink-0 p-2 px-4 rounded-full border transition-colors duration-150 text-sm sm:text-base ${
              activeTab === tabItem.key
                ? 'bg-primary-800 text-white'
                : 'border-primary-800 text-primary-800'
            }`}
            onClick={() => handleTabChange(tabItem.key)}
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 p-2 sm:p-4 rounded-md bg-white ">
        <ActiveComponent editable={editable} />
      </div>
    </div>
  );
}
