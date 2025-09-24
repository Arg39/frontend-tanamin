import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../../components/form/textInput';
import { useState, useEffect } from 'react';
import Icon from '../../../components/icons/icon';
import useCertificateStore from '../../../zustand/public/course/learning/certificateStore';

export function CertificateInputPage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Verifikasi Sertifikat', path: location.pathname },
  ];

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/verifikasi/sertifikat-kursus/${code.trim()}`);
    }
  };

  return (
    <Template activeNav="course.verifikasi sertifikat" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-10 sm:mt-16 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mb-2 text-center drop-shadow-lg">
            Verifikasi Sertifikat Kursus
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center max-w-xl">
            Masukkan kode sertifikat Anda untuk memastikan keaslian dan status sertifikat kursus
            <span className="text-primary-600 font-semibold"> Tanamin</span>.
          </p>
          <form
            className="w-full max-w-md sm:max-w-2xl md:max-w-3xl px-2 sm:px-0"
            onSubmit={handleSubmit}
          >
            <TextInput
              label="Kode Sertifikat"
              name="certificateCode"
              value={code}
              onChange={handleChange}
              placeholder="Masukkan kode sertifikat"
              required
              transformToUpperDash // NEW PROP
            />
            <button
              type="submit"
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition text-base sm:text-lg"
              disabled={!code.trim()}
            >
              Verifikasi
            </button>
          </form>
        </div>
      </main>
    </Template>
  );
}

export default function VerifyCertificate() {
  const location = useLocation();
  const { certificateCode } = useParams();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Verifikasi Sertifikat', path: location.pathname },
  ];

  const { certificate, loading, error, status, verifyCertificate, reset } = useCertificateStore();

  useEffect(() => {
    if (certificateCode) {
      verifyCertificate(certificateCode);
    }
    return () => reset();
    // eslint-disable-next-line
  }, [certificateCode]);

  return (
    <Template activeNav="course.verifikasi sertifikat" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex-1 w-full mt-10 sm:mt-16 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-700 mb-2 text-center drop-shadow-lg">
            Verifikasi Sertifikat Kursus
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center max-w-xl">
            Masukkan kode sertifikat Anda untuk memastikan keaslian dan status sertifikat dari
            <span className="text-primary-600 font-semibold"> Tanamin Course</span>.
          </p>
          <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl px-2 sm:px-0">
            {loading ? (
              <div className="border rounded-2xl shadow-xl p-6 sm:p-8 bg-white animate-fade-in text-center">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mb-3">
                  <Icon type="loader" className="w-6 h-6 text-primary-600 animate-spin" />
                </span>
                <p className="text-primary-700 font-semibold text-base sm:text-lg">
                  Memeriksa sertifikat...
                </p>
              </div>
            ) : status === 'success' && certificate ? (
              <div className="border rounded-2xl shadow-xl p-6 sm:p-8 bg-white animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center mb-4 gap-2 sm:gap-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                    <Icon
                      type="check"
                      className="w-6 h-6 text-primary-600"
                      color="#059669"
                      strokeWidth={2}
                    />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-700 text-center sm:text-left">
                    Sertifikat Valid
                  </h2>
                  <span className="sm:ml-auto px-3 py-1 bg-primary-200 text-primary-800 rounded-full text-xs font-semibold mt-2 sm:mt-0">
                    Verified
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-bold text-tertiary-700">Kode Sertifikat:</span>
                    <span className="ml-0 sm:ml-2 font-mono text-primary-700 text-lg">
                      {certificate.certificateCode}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-bold text-tertiary-700">Nama:</span>
                    <span className="ml-0 sm:ml-2">{certificate.userFullname}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-bold text-tertiary-700">Kursus:</span>
                    <span className="ml-0 sm:ml-2">{certificate.courseTitle}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-bold text-tertiary-700">Tanggal:</span>
                    <span className="ml-0 sm:ml-2">{certificate.issuedAt}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-bold text-tertiary-700">Status:</span>
                    <span className="ml-0 sm:ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded">
                      Valid
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-2xl shadow-xl p-6 sm:p-8 bg-white animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center mb-4 gap-2 sm:gap-0">
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                    <Icon
                      type="x-mark"
                      className="w-6 h-6 text-red-600"
                      color="#dc2626"
                      strokeWidth={2}
                    />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-red-700 text-center sm:text-left">
                    Sertifikat Tidak Ditemukan
                  </h2>
                  <span className="sm:ml-auto px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-semibold mt-2 sm:mt-0">
                    Invalid
                  </span>
                </div>
                <p className="text-gray-700 text-base sm:text-lg">
                  {error ? (
                    error
                  ) : (
                    <>
                      Kode sertifikat{' '}
                      <span className="font-mono text-red-700">{certificateCode}</span> tidak valid
                      atau tidak terdaftar.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </Template>
  );
}
