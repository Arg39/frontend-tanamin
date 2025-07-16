import React, { useEffect } from 'react';
import Icon from '../../../../../../components/icons/icon';
import { useNavigate } from 'react-router-dom';
import useCompanyStore from '../../../../../../zustand/companyProfileStore';

const PLACEHOLDER = (
  <span className="italic text-error-500 p-2 bg-red-200 rounded-md">
    Belum diatur, silakan edit
  </span>
);

export default function ProfilPerusahaan() {
  const navigate = useNavigate();
  const { companyProfile, loading, error, notFound, fetchCompanyProfile } = useCompanyStore();

  useEffect(() => {
    fetchCompanyProfile();
  }, [fetchCompanyProfile]);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
        <div className="text-center py-10 text-primary-700">Memuat data perusahaan...</div>
      </div>
    );
  }

  if (error && !notFound) {
    return (
      <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
        <div className="text-center py-10 text-red-600">{error}</div>
      </div>
    );
  }

  // Selalu render meski notFound, agar bisa edit
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-2 sm:mb-4">
          Profil Perusahaan
        </h2>
        <button
          className="flex gap-2 p-2 px-4 text-white bg-primary-700 hover:bg-primary-800 rounded-md w-full sm:w-auto"
          onClick={() => navigate('/admin/tentang-perusahaan/profil/edit')}
        >
          <Icon type={'edit'} className={'w-4 h-4'} />
          Edit
        </button>
      </div>
      {/* About */}
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow border mb-4">
        <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
          Tentang Perusahaan
        </span>
        <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
          {companyProfile?.about ? companyProfile.about : PLACEHOLDER}
        </div>
      </div>

      {/* Vision */}
      <div className="bg-white mb-4 rounded-lg p-3 sm:p-6 shadow border">
        <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">Visi</span>
        <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
          {companyProfile?.vision ? companyProfile.vision : PLACEHOLDER}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white mb-4 rounded-lg p-3 sm:p-6 shadow border">
        <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">Misi</span>
        <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
          {Array.isArray(companyProfile?.mission) && companyProfile.mission.length > 0 ? (
            <ol className="list-decimal pl-5 space-y-1">
              {companyProfile.mission.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ol>
          ) : companyProfile?.mission ? (
            companyProfile.mission
          ) : (
            PLACEHOLDER
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow border">
        <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-3">
          Statistik Perusahaan
        </span>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {companyProfile?.statistics && companyProfile.statistics.length > 0 ? (
            companyProfile.statistics.map((stat, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[140px] max-w-full sm:min-w-[120px] md:min-w-[160px] flex flex-col items-center justify-start bg-primary-50 rounded-lg p-3 sm:p-4 shadow-inner"
                style={{ flexBasis: 'calc(50% - 0.75rem)' }} // 2 per row on mobile, gap-3
              >
                <div className="text-xl sm:text-3xl font-bold text-primary-700 break-words text-center">
                  {stat.value}
                  {stat.unit && <span className="text-base font-normal ml-1">{stat.unit}</span>}
                </div>
                <div className="text-xs sm:text-base text-primary-600 mt-1 text-center break-words">
                  {stat.title}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full">{PLACEHOLDER}</div>
          )}
        </div>
      </div>
    </>
  );
}
