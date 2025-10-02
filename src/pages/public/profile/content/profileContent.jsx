import React, { useEffect } from 'react';
import ProfileSidebar from '../profileSidebar';
import useProfileStore from '../../../../zustand/profileStore';

export default function ProfileContent() {
  const { profile, loading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <ProfileSidebar>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Loading...</p>
        </div>
      </ProfileSidebar>
    );
  }

  if (error) {
    return (
      <ProfileSidebar>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </ProfileSidebar>
    );
  }

  if (!profile) {
    return (
      <ProfileSidebar>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Profil tidak ditemukan.</p>
        </div>
      </ProfileSidebar>
    );
  }

  return (
    <ProfileSidebar>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold border-b-2 pb-4 mb-6">Profil Saya</h1>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Nama depan</p>
          <p className="w-full md:w-4/5">{profile.first_name || '-'}</p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Nama belakang</p>
          <p className="w-full md:w-4/5">{profile.last_name || '-'}</p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Username</p>
          <p className="w-full md:w-4/5">{profile.username || '-'}</p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Email</p>
          <p className="w-full md:w-4/5">{profile.email || '-'}</p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Telepon</p>
          <p className="w-full md:w-4/5">
            {profile.telephone
              ? profile.telephone.replace(/(.{4})/g, '$1-').replace(/-$/, '')
              : '-'}
          </p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Bidang Keahlian</p>
          <p className="w-full md:w-4/5">{profile.detail?.expertise || '-'}</p>
        </div>
        <div className="w-full flex flex-col md:flex-row mb-8">
          <p className="w-full md:w-1/5 mb-2 md:mb-0 font-medium">Tentang Saya</p>
          <p className="w-full md:w-4/5">{profile.detail?.about || '-'}</p>
        </div>
      </div>
    </ProfileSidebar>
  );
}
