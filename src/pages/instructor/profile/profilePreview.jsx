import React from 'react';
import Icon from '../../../components/icons/icon';

function getUnsetText(showEdit) {
  return showEdit ? 'Belum diatur, silahkan edit untuk mengaturnya!' : 'Belum diatur';
}

export default function ProfilePreview({
  profile,
  loading,
  error,
  onBack,
  onEdit,
  showEdit = true,
  showBack = true,
}) {
  return (
    <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
      {/* Back Button */}
      {showBack && (
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 rounded-md mb-3 sm:mb-4 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={onBack}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>
      )}

      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700">Detail Profile User</h2>
        {showEdit && (
          <button
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary-700 text-white rounded-md hover:bg-primary-700 transition-colors text-sm sm:text-base"
            onClick={onEdit}
          >
            <Icon type="edit" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Loading & Error */}
      {loading && <div className="text-center text-primary-700 py-8">Memuat profil...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {/* Content */}
      {profile && !loading && !error && (
        <>
          {/* Photo Cover */}
          <div className="w-full mb-4 sm:mb-6 rounded-lg overflow-hidden bg-white p-2 sm:p-4 shadow">
            <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
              Foto Cover Profile
            </span>
            {profile.photo_cover ? (
              <div className="w-full aspect-[3/1]">
                <img
                  src={profile.photo_cover}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/1] rounded-lg overflow-hidden bg-primary-100 flex items-center justify-center shadow">
                <span className="text-primary-700 font-medium text-base sm:text-lg">
                  Belum ada cover
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
            {/* Photo & Social */}
            <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center bg-white rounded-lg p-4 sm:p-6 shadow border border-gray-100 mx-auto mb-4 md:mb-0">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 mb-3 sm:mb-4 shadow"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center rounded-full bg-gray-100 border-4 mb-3 sm:mb-4 shadow">
                  <Icon type="user" className="w-14 h-14 sm:w-20 sm:h-20 text-gray-600" />
                </div>
              )}
              <div className="text-lg sm:text-xl text-primary-700 font-medium break-all text-center">
                @{profile.username}
              </div>
              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3 flex-wrap justify-center overflow-x-auto max-w-full">
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
                      <Icon type={sm.type} className="w-6 h-6 sm:w-7 sm:h-7" />
                    </a>
                  ))}
              </div>
            </div>

            {/* Detail Info */}
            <div className="flex-1 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow border space-y-3 sm:space-y-4">
                {[
                  ['First Name', profile.first_name],
                  ['Last Name', profile.last_name],
                  ['Email', profile.email],
                  ['Telepon', profile.telephone],
                  ['Keahlian', profile.expertise],
                ].map(([label, value], idx) => (
                  <div key={idx} className="min-w-0">
                    <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
                      {label}
                    </span>
                    <div className="text-base sm:text-lg text-primary-700 font-medium break-all whitespace-pre-wrap mt-1 sm:mt-2">
                      {value && value.trim && value.trim() !== '' ? (
                        value
                      ) : (
                        <span className="block text-red-500 font-normal text-xs sm:text-sm p-2 bg-error-100 rounded-md">
                          {getUnsetText(showEdit)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow border flex flex-col mt-4 md:mt-0">
                <span className="block text-tertiary-500 text-xs font-medium mb-1">
                  Tentang Instruktur
                </span>
                <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
                  {profile.about && profile.about.trim && profile.about.trim() !== '' ? (
                    profile.about
                  ) : (
                    <span className="block text-red-500 font-normal text-xs sm:text-sm p-2 bg-error-100 rounded-md">
                      {getUnsetText(showEdit)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
