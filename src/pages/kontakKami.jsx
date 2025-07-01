import React from 'react';
import Template from '../template/template';
import Breadcrumb from '../components/breadcrumb/breadcrumb2';
import { useLocation } from 'react-router-dom';
import Icon from '../components/icons/icon';

export default function KontakKami() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Frequently Asked Questions', path: location.pathname },
  ];

  return (
    <Template activeNav="kontak-kami" locationKey={location.key}>
      <main className="min-h-screen bg-white-100 xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-700 mb-4">
            Hubungi Kami
          </h1>

          <div className="mt-4 flex justify-between gap-4 items-stretch min-h-[400px] h-[500px]">
            <div className="w-1/2 h-full flex">
              <img
                src="https://images.unsplash.com/photo-1587560699334-bea93391dcef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Kontak Kami"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>

            {/* form */}
            <div className="w-1/2 h-full p-4 bg-white-100 rounded-lg border border-primary-700 flex flex-col justify-center overflow-hidden">
              <p className="text-xl text-primary-700 font-semibold mb-1">Menghubungi</p>
              <p className="text-primary-700">Anda dapat menghubungi kami kapan saja</p>
              <form className="flex flex-col gap-4 mt-4 flex-1 justify-start overflow-auto">
                <input
                  type="text"
                  placeholder="Nama..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700"
                />
                <input
                  type="email"
                  placeholder="Email..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700"
                />
                <input
                  type="text"
                  placeholder="Subjek..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700"
                />
                <textarea
                  placeholder="Pesan anda..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700"
                  rows={4}
                />
                <button
                  type="submit"
                  className="mt-2 bg-primary-700 text-white-100 font-semibold py-2 px-4 rounded hover:bg-primary-800 transition flex items-center justify-center"
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
            <p className="text-3xl font-bold text-primary-700">Kontak</p>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {/* Telepon */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white-100 text-lg flex items-center">
                  <Icon type={'phone'} className="inline mr-2" />
                  Telepon
                </p>
                <p className="text-white-100 mt-2">+62-821-3232-8945</p>
                <p className="text-white-100">+62-821-3232-8945</p>
              </div>
              {/* Email */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white-100 text-lg flex items-center">
                  <Icon type={'mail'} className="inline mr-2" />
                  Email
                </p>
                <p className="text-white-100 mt-2">info@tanamin.com</p>
              </div>
              {/* Instagram */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white-100 text-lg flex items-center">
                  <Icon type={'instagram'} className="inline mr-2" />
                  Instagram
                </p>
                <p className="text-white-100 mt-2">@tanamin.id</p>
              </div>
              {/* linkedin */}
              <div className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full">
                <p className="mt-4 text-white-100 text-lg flex items-center">
                  <Icon type={'linkedin'} className="inline mr-2" />
                  LinkedIn
                </p>
                <p className="text-white-100 mt-2">@tanamin</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Template>
  );
}
