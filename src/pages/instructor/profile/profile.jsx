import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InstructorTemplate from '../../../template/templateInstructor';
import Icon from '../../../components/icons/icon';
import useProfileStore from '../../../zustand/profileStore';

export default function InstructorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const breadcrumbItems = [{ label: 'Profile', path: location.pathname }];

  return (
    <InstructorTemplate breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-6 shadow-md">
        {/* Back Button */}
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>

        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <h2 className="text-2xl font-bold text-primary-700">Profile Instruktur</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-700 transition-colors"
            onClick={() => navigate('/instruktur/profile/edit')}
          >
            <Icon type="edit" />
            Edit Profile
          </button>
        </div>

        {/* Loading & Error */}
        {loading && <div className="text-center text-primary-700 py-8">Memuat profil...</div>}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}

        {/* Content */}
        {profile && !loading && !error && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo & Social */}
            <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-100 mx-auto">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 mb-4 shadow"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 border-4 mb-4 shadow">
                  <Icon type="user" className="w-20 h-20 text-gray-600" />
                </div>
              )}
              <div className="text-xl text-primary-700 font-semibold break-all text-center">
                @{profile.username}
              </div>
              <div className="flex gap-3 mt-3 flex-wrap justify-center">
                {profile.social_media &&
                  profile.social_media.length > 0 &&
                  profile.social_media.map((sm, idx) => (
                    <a
                      key={idx}
                      href={sm.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary-600 transition"
                    >
                      <Icon type={sm.type} className="w-7 h-7" />
                    </a>
                  ))}
              </div>
            </div>

            {/* Detail Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow border space-y-4">
                {[
                  ['First Name', profile.first_name],
                  ['Last Name', profile.last_name],
                  ['Email', profile.email],
                  ['Telepon', profile.telephone],
                  ['Keahlian', profile.expertise],
                ].map(([label, value], idx) => (
                  <div key={idx} className="min-w-0">
                    <span className="block text-tertiary-500 text-xs font-semibold mb-1">
                      {label}
                    </span>
                    <div className="text-base text-primary-700 font-semibold break-all whitespace-pre-wrap mt-2">
                      {value && value.trim && value.trim() !== '' ? (
                        value
                      ) : (
                        <span className="text-red-500 font-normal text-sm p-2 bg-error-100 rounded-md">
                          Belum diatur, silahkan edit untuk mengaturnya!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-6 shadow border flex flex-col">
                <span className="block text-tertiary-500 text-xs font-semibold mb-1">
                  Tentang Instruktur
                </span>
                <div className="text-base text-primary-700 font-semibold whitespace-pre-wrap break-words mt-1">
                  {profile.about && profile.about.trim && profile.about.trim() !== '' ? (
                    profile.about
                  ) : (
                    <span className="text-red-500 font-normal text-sm p-2 bg-error-100 rounded-md">
                      Belum diatur, silahkan edit untuk mengaturnya!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorTemplate>
  );
}
