import React from 'react';
import Template from '../../template/template';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/icons/icon';
import useMessageStore from '../../zustand/public/contact/messageStore';
import useCompanyContactStore from '../../zustand/companyContactStore';
import { toast } from 'react-toastify';

export default function KontakKami() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kontak Kami', path: location.pathname },
  ];

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { loading, error, success, sendMessage, resetStatus } = useMessageStore();

  // Company contact store
  const {
    contact,
    loading: contactLoading,
    error: contactError,
    fetchContact,
  } = useCompanyContactStore();

  React.useEffect(() => {
    fetchContact();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => resetStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, resetStatus]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(form);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Pesan berhasil dikirim!');
    } catch {
      // Error sudah ditangani di store
    }
  };

  const renderSocialMediaLink = (type, url) => {
    if (!url) return '-';
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline break-all">
        {url}
      </a>
    );
  };

  // Array of contact items for grid rendering
  const contactItems = [
    {
      label: 'Telepon',
      icon: 'phone',
      value: contact.telephone,
    },
    {
      label: 'Email',
      icon: 'mail',
      value: contact.email,
    },
    {
      label: 'Alamat',
      icon: 'map',
      value: contact.address,
    },
    {
      label: 'Instagram',
      icon: 'instagram',
      value: contact.social_media?.instagram,
      isSocial: true,
    },
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      value: contact.social_media?.linkedin,
      isSocial: true,
    },
    {
      label: 'Twitter',
      icon: 'twitter-x',
      value: contact.social_media?.twitter,
      isSocial: true,
    },
    {
      label: 'Facebook',
      icon: 'facebook',
      value: contact.social_media?.facebook,
      isSocial: true,
    },
  ];

  // Fungsi untuk membuat grid tetap center jika item < 3
  const getCenteredGridItems = (items) => {
    const gridCols = 3;
    const length = items.length;
    if (length % gridCols === 1) {
      // Sisa 1, tambahkan 1 div kosong di awal dan 1 di akhir
      return [<div key="empty-start" />, items[0], <div key="empty-end" />];
    }
    if (length % gridCols === 2) {
      // Sisa 2, tambahkan 1 div kosong di awal
      return [<div key="empty-start" />, ...items];
    }
    return items;
  };

  // Render grid items per baris, agar baris terakhir tetap center
  const renderGridItems = () => {
    const gridCols = 3;
    const rows = [];
    for (let i = 0; i < contactItems.length; i += gridCols) {
      const slice = contactItems.slice(i, i + gridCols);
      let items = slice.map((item, idx) => (
        <div
          key={i + idx}
          className="bg-primary-700 p-4 rounded-lg shadow-md flex flex-col items-start w-full"
        >
          <p className="mt-4 text-white text-base sm:text-lg flex items-center">
            <Icon type={item.icon} className="inline mr-2" />
            {item.label}
          </p>
          <p className="text-white mt-2 text-sm sm:text-base break-all">
            {contactLoading
              ? 'Memuat...'
              : item.isSocial
              ? renderSocialMediaLink(item.icon, item.value)
              : item.value || '-'}
          </p>
          {contactError && (
            <p className="text-white text-xs mt-1 break-all">Gagal memuat kontak: {contactError}</p>
          )}
        </div>
      ));
      // Jika baris terakhir dan jumlah item < 3, center-kan
      if (slice.length < gridCols) {
        items = getCenteredGridItems(items);
      }
      rows.push(<React.Fragment key={`row-${i}`}>{items}</React.Fragment>);
    }
    return rows;
  };

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
              <form
                className="flex flex-col gap-3 sm:gap-4 mt-4 flex-1 justify-start overflow-auto"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subjek..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                  required
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Pesan anda..."
                  className="mt-1 p-2 border bg-neutral-50 rounded-lg border-neutral-100 placeholder-primary-700 placeholder-opacity-80 text-sm sm:text-base"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 bg-primary-700 text-white font-semibold py-2 px-4 rounded hover:bg-primary-800 placeholder-opacity-80 transition flex items-center justify-center text-sm sm:text-base"
                >
                  <Icon type={'send'} className="inline mr-2" />
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
                {success && (
                  <div className="text-green-600 text-sm mt-2">Pesan berhasil dikirim!</div>
                )}
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              </form>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="mt-16 w-full flex justify-center">
            <p className="text-2xl sm:text-3xl font-bold text-primary-700">Kontak</p>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 justify-items-center gap-6 w-full">
              {renderGridItems()}
            </div>
          </div>
        </div>
      </main>
    </Template>
  );
}
