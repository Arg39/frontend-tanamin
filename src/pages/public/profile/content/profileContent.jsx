import React from 'react';
import Icon from '../../../../components/icons/icon';

export default function UserProfileContent({ profile, isMobile }) {
  if (!profile) {
    return (
      <div
        className={`w-full p-4 md:p-6 flex flex-col md:flex-row items-center gap-4
          ${isMobile ? 'relative bg-secondary-600 rounded-lg' : 'md:absolute md:bottom-0 md:left-0'}
        `}
      >
        <div className="w-20 h-20 md:w-40 md:h-40 rounded-full border-4 border-white flex items-center justify-center bg-white animate-pulse" />
        <div className="w-full mt-4 md:mt-0">
          {/* <h2 className="text-white text-xl md:text-2xl font-semibold bg-gray-300 rounded w-32 md:w-48 h-6 md:h-8 animate-pulse" />
          <h2 className="text-white text-lg md:text-xl bg-gray-300 rounded w-24 md:w-40 h-5 md:h-7 animate-pulse" /> */}
          <div className="flex flex-col gap-4 md:gap-6 mt-2 md:mt-4">
            <p className="bg-gray-300 rounded w-20 md:w-32 h-4 md:h-6 animate-pulse" />
            <p className="bg-gray-300 rounded w-24 md:w-36 h-4 md:h-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full p-4 md:p-6 flex flex-col md:flex-row items-center gap-4
        ${isMobile ? 'relative bg-secondary-600 rounded-lg' : 'md:absolute md:bottom-0 md:left-0'}
      `}
    >
      {profile?.photo_profile ? (
        <img
          src={profile.photo_profile}
          alt={profile.full_name || `${profile.first_name} ${profile.last_name}`}
          className="w-20 h-20 md:w-40 md:h-40 rounded-full border-4 border-white object-cover"
        />
      ) : (
        <div className="w-20 md:w-40 aspect-square rounded-full border-4 border-white flex items-center justify-center bg-white overflow-hidden">
          <Icon type="user" className="text-black w-10 h-10 md:w-16 md:h-16" />
        </div>
      )}
      <div className="w-full mt-4 md:mt-0">
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          {profile?.first_name} {profile?.last_name}
        </h2>
        <h2 className="text-white text-lg md:text-xl">{profile?.category_instructor}</h2>
        <div className="flex flex-col gap-2 mt-2">
          <p className="flex items-center gap-2 text-white text-sm md:text-base">
            <Icon type={'users'} className={'w-6 h-6 md:w-8 md:h-8'} />
            {profile?.total_courses ?? 0} Kursus
          </p>
          <p className="flex items-center gap-2 text-white text-sm md:text-base">
            <Icon type={'date'} className={'w-6 h-6 md:w-7 md:h-7'} />
            bergabung sejak {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
