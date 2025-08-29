import React, { useEffect } from 'react';
import Icon from '../../../../../../components/icons/icon';
import { useNavigate } from 'react-router-dom';
import useCompanyContactStore from '../../../../../../zustand/companyContactStore';

const PLACEHOLDER = (
  <span className="italic text-error-500 p-2 bg-red-200 rounded-md">
    Belum diatur, silakan edit
  </span>
);

export default function KontakPerusahaan() {
  const navigate = useNavigate();
  const { contact, loading, error, fetchContact } = useCompanyContactStore();

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-2 sm:mb-4">
          Kontak Perusahaan
        </h2>
        <button
          className="flex gap-2 p-2 px-4 text-white bg-primary-700 hover:bg-primary-800 rounded-md w-full sm:w-auto"
          onClick={() => navigate('/admin/tentang-perusahaan/kontak/edit')}
        >
          <Icon type={'edit'} className={'w-4 h-4'} />
          Edit
        </button>
      </div>
      {loading && <div className="text-primary-700 mb-4">Memuat data kontak...</div>}
      {error && <div className="text-error-500 mb-4">Gagal memuat kontak: {error}</div>}
      {!loading && !error && (
        <>
          <div className="flex flex-row gap-4">
            {/* telpon */}
            <div className="w-full bg-white rounded-lg p-3 sm:p-6 shadow border mb-4">
              <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
                Nomor Telepon
              </span>
              <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
                {contact?.telephone ? contact.telephone : PLACEHOLDER}
              </div>
            </div>
            {/* email */}
            <div className="w-full bg-white rounded-lg p-3 sm:p-6 shadow border mb-4">
              <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
                Email
              </span>
              <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
                {contact?.email ? contact.email : PLACEHOLDER}
              </div>
            </div>
          </div>
          {/* alamat */}
          <div className="w-full bg-white rounded-lg p-3 sm:p-6 shadow border mb-4">
            <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
              Alamat
            </span>
            <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1">
              {contact?.address ? contact.address : PLACEHOLDER}
            </div>
          </div>
          {/* sosial media */}
          <div className="w-full bg-white rounded-lg p-3 sm:p-6 shadow border mb-4">
            <span className="block text-tertiary-500 text-xs sm:text-sm font-medium mb-1">
              Sosial Media
            </span>
            <div className="text-sm sm:text-base text-primary-700 font-medium whitespace-pre-wrap break-words mt-1 flex flex-col gap-1">
              {contact?.social_media ? (
                <>
                  <div>
                    <span className="font-semibold">Instagram: </span>
                    {contact.social_media.instagram ? (
                      <a
                        href={
                          contact.social_media.instagram.startsWith('http://') ||
                          contact.social_media.instagram.startsWith('https://')
                            ? contact.social_media.instagram
                            : `${contact.social_media.instagram}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {contact.social_media.instagram}
                      </a>
                    ) : (
                      PLACEHOLDER
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Facebook: </span>
                    {contact.social_media.facebook ? (
                      <a
                        href={
                          contact.social_media.facebook.startsWith('http://') ||
                          contact.social_media.facebook.startsWith('https://')
                            ? contact.social_media.facebook
                            : `${contact.social_media.facebook}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {contact.social_media.facebook}
                      </a>
                    ) : (
                      PLACEHOLDER
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">LinkedIn: </span>
                    {contact.social_media.linkedin ? (
                      <a
                        href={
                          contact.social_media.linkedin.startsWith('http://') ||
                          contact.social_media.linkedin.startsWith('https://')
                            ? contact.social_media.linkedin
                            : `${contact.social_media.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {contact.social_media.linkedin}
                      </a>
                    ) : (
                      PLACEHOLDER
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Twitter: </span>
                    {contact.social_media.twitter ? (
                      <a
                        href={
                          contact.social_media.twitter.startsWith('http://') ||
                          contact.social_media.twitter.startsWith('https://')
                            ? contact.social_media.twitter
                            : `${contact.social_media.twitter}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {contact.social_media.twitter}
                      </a>
                    ) : (
                      PLACEHOLDER
                    )}
                  </div>
                </>
              ) : (
                PLACEHOLDER
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
