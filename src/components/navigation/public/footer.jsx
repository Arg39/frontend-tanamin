import React from 'react';
import TextInput from '../../form/textInput';
import Icon from '../../icons/icon';

export default function Footer({ contact, loading, error }) {
  const { telephone, email, social_media = {} } = contact || {};

  // Check if all contact info is missing/empty
  const isContactEmpty =
    (!telephone || telephone.trim() === '') &&
    (!email || email.trim() === '') &&
    (!social_media ||
      ((!social_media.facebook || social_media.facebook.trim() === '') &&
        (!social_media.instagram || social_media.instagram.trim() === '') &&
        (!social_media.twitter || social_media.twitter.trim() === '') &&
        (!social_media.linkedin || social_media.linkedin.trim() === '')));

  // Check if all social media fields are missing/empty
  const isSocialMediaEmpty =
    !social_media ||
    ((!social_media.facebook || social_media.facebook.trim() === '') &&
      (!social_media.instagram || social_media.instagram.trim() === '') &&
      (!social_media.twitter || social_media.twitter.trim() === '') &&
      (!social_media.linkedin || social_media.linkedin.trim() === ''));

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col gap-6 md:gap-4 pb-4 border-b border-primary-700">
        <div className="w-full flex flex-col gap-4 mb-6 md:mb-0">
          <img
            src="/assets/logo.png"
            alt="Logo-Tanamin"
            className="w-fit h-10 lg:h-16 mb-2 md:mb-0"
          />
          <div className="flex flex-col md:flex-row w-full">
            <div className="md:w-2/3 w-full flex flex-col pr-8">
              <p className="md:text-left text-center md:text-base text-sm mb-2">
                PT Tanamin menyediakan berbagai course yang terbagi menjadi beberapa bidang keahlian
                sesuai dengan kebutuhan Anda, dengan penawaran terjangkau.
              </p>
              {/* Only show social media icons if not empty */}
              {!isSocialMediaEmpty && (
                <div className="w-full flex flex-row gap-2 justify-center md:justify-start mb-2 md:mb-0">
                  {social_media.facebook && social_media.facebook.trim() !== '' && (
                    <a
                      href={social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors"
                    >
                      <Icon type={'facebook'} className={'w-6 h-6'} />
                    </a>
                  )}
                  {social_media.instagram && social_media.instagram.trim() !== '' && (
                    <a
                      href={social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors"
                    >
                      <Icon type={'instagram'} className={'w-6 h-6'} />
                    </a>
                  )}
                  {social_media.twitter && social_media.twitter.trim() !== '' && (
                    <a
                      href={social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors"
                    >
                      <Icon type={'twitter'} className={'w-6 h-6'} />
                    </a>
                  )}
                  {social_media.linkedin && social_media.linkedin.trim() !== '' && (
                    <a
                      href={social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors"
                    >
                      <Icon type={'linkedin'} className={'w-6 h-6'} />
                    </a>
                  )}
                </div>
              )}
            </div>
            {/* Only show contact info if not empty */}
            {!isContactEmpty && (
              <div className="md:w-1/3 w-full flex flex-col items-start md:items-start gap-1 mt-4 md:mt-0">
                <p className="font-bold md:text-left text-center">Kontak Kami</p>
                <p className="font-light md:text-left text-center">Telepon: {telephone || '-'}</p>
                <p className="font-light md:text-left text-center">Email: {email || '-'}</p>
                {loading && <p className="text-xs text-gray-500">Memuat kontak...</p>}
                {error && <p className="text-xs text-red-500">Gagal memuat kontak: {error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-primary-700 mt-2 text-xs md:text-base text-center md:text-left">
        Copyright - 2025 - PT Tanamin Bumi Nusantara. All right Reserved.
      </p>
    </div>
  );
}
