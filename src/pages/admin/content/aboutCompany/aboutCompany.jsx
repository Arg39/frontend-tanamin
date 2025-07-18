import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import useNavigationStore from '../../../../zustand/navigationStore';
import ProfilPerusahaan from './tabs/proflPerusahaan/profilPerusahaan';
import KegiatanPerusahaan from './tabs/kegiatanPerusahan/kegiatanPerusahaan';
import KerjaSama from '../aboutCompany/tabs/kerjaSama/kerjaSama';

const tabComponents = {
  profil: ProfilPerusahaan,
  kegiatan: KegiatanPerusahaan,
  'kerja-sama': KerjaSama,
};

export default function AdminAboutCompany() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tab } = useParams();
  const tabs = useNavigationStore((state) => state.companyAboutTabs);
  const activeTab = tab || 'profil';
  const breadcrumbItems = [{ label: 'Tentang Perusahaan', path: location.pathname }];

  const handleTabChange = (tabKey) => {
    navigate(`/admin/tentang-perusahaan/${tabKey}`);
  };

  const ActiveComponent = tabComponents[activeTab] || ProfilPerusahaan;

  return (
    <AdminTemplate activeNav={'tentang perusahaan'} breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col">
        <h1 className="mb-4 text-lg sm:text-2xl font-bold">Tentang Perusahaan</h1>
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
        <div className="border border-gray-200 p-2 sm:p-4 rounded-md bg-white mt-4">
          <ActiveComponent />
        </div>
      </div>
    </AdminTemplate>
  );
}
