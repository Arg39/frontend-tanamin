import React from 'react';
import Template from '../../template/template';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/icons/icon';

export default function KontakKami() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kontak Kami', path: location.pathname },
  ];

  return (
    <Template activeNav="kontak-kami" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-2 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Hubungi Kami
          </h1>

          <div className="mt-4 flex flex-col md:flex-row justify-between gap-4 items-stretch min-h-[400px] md:h-[500px]">
            <div className="w-full md:w-1/2 h-48 md:h-full flex mb-4 md:mb-0">
              <img
                src="/assets/illustration-kontak-kami.png"
                alt="Kontak Kami"
                className="w-full h-full object-cover rounded-lg "
              />
            </div>

            {/* form */}
            <div className="w-full md:w-1/2 h-auto md:h-full p-2 sm:p-4 bg-white rounded-lg border border-primary-700 flex flex-col justify-center overflow-hidden">
              <p className="text-lg sm:text-xl text-primary-700 font-semibold mb-1">Menghubungi</p>
              <p className="text-primary-700 text-sm sm:text-base">
                Anda dapat menghubungi kami kapan saja
              </p>
              <form className="flex flex-col gap-3 sm:gap-4 mt-4 flex-1 justify-start overflow-auto">
                <input
                  type="text"
                  placeholder="Nama..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                />
                <input
                  type="email"
                  placeholder="Email..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Subjek..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                />
                <textarea
                  placeholder="Pesan anda..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                  rows={4}
                />
                <button
                  type="submit"
                  className="mt-2 bg-primary-700 text-white font-semibold py-2 px-4 rounded hover:bg-primary-800 placeholder-opacity-80 transition flex items-center justify-center text-sm sm:text-base"
                >
                  <Icon type={'send'} className="inline mr-2" />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="mt-16 w-full flex justify-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary-700">Kontak</p>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {/* Telepon */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white text-base sm:text-lg flex items-center">
                  <Icon type={'phone'} className="inline mr-2" />
                  Telepon
                </p>
                <p className="text-white mt-2 text-sm sm:text-base">+62-821-3232-8945</p>
                <p className="text-white text-sm sm:text-base">+62-821-3232-8945</p>
              </div>
              {/* Email */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white text-base sm:text-lg flex items-center">
                  <Icon type={'mail'} className="inline mr-2" />
                  Email
                </p>
                <p className="text-white mt-2 text-sm sm:text-base">info@tanamin.com</p>
              </div>
              {/* Instagram */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white text-base sm:text-lg flex items-center">
                  <Icon type={'instagram'} className="inline mr-2" />
                  Instagram
                </p>
                <p className="text-white mt-2 text-sm sm:text-base">@tanamin.id</p>
              </div>
              {/* linkedin */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white text-base sm:text-lg flex items-center">
                  <Icon type={'linkedin'} className="inline mr-2" />
                  LinkedIn
                </p>
                <p className="text-white mt-2 text-sm sm:text-base">@tanamin</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Template>
  );
}
