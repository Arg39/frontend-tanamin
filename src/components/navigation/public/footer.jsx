import React from 'react';
import TextInput from '../../form/textInput';
import Icon from '../../icons/icon';

export default function Footer() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-4 text-center pb-2 border-b border-primary-700">
        <div className="w-full flex flex-col items-start gap-4 mb-6 md:mb-0">
          <img src="/assets/logo.png" alt="Logo-Tanamin" className="w-fit h-10 lg:h-16" />
          <p className="text-left">
            PT Tanamin menyediakan berbagai course yang terbagi menjadi beberapa bidang keahlian
            sesuai dengan kebutuhan Anda, dengan penawaran terjangkau.
          </p>
          <div className="flex flex-row gap-2 justify-center sm:justify-start w-full">
            <button className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
              <Icon type={'facebook'} className={'w-6 h-6'} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
              <Icon type={'instagram'} className={'w-6 h-6'} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
              <Icon type={'twitter-x'} className={'w-6 h-6'} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border bg-gray-200 hover:bg-primary-700 text-primary-700 hover:text-white transition-colors">
              <Icon type={'linkedin'} className={'w-6 h-6'} />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-2">
            <p className="font-bold">Informasi Utama</p>
            <p className="font-light">Telepon: </p>
            <p className="font-light">Email: </p>
          </div>
          <div className="w-full flex flex-col items-start gap-2">
            <p className="font-bold">News Letter</p>
            <div className="w-full flex items-start flex-col gap-2">
              <p className="font-light">Dapatkan informasi terbaru dari kami melalui email Anda:</p>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                <div className="w-full sm:w-3/4">
                  <TextInput name="email" placeholder={'Masukkan alamat e-mail'} />
                </div>
                <button className="w-full sm:w-1/4 p-2 flex items-center text-lg gap-2 justify-center bg-primary-700 text-white rounded-md">
                  <Icon type={'send'} className={'w-5 h-5'} />
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-primary-700 mt-2 text-xs md:text-base text-center md:text-left">
        Copyright - 2025 - PT Tanamin Bumi Nusantara. All right Reserved.
      </p>
    </div>
  );
}
