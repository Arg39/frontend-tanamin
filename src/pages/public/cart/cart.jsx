import React from 'react';
import Template from '../../../template/template';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/icons/icon';
import useConfirmationModalStore from '../../../zustand/confirmationModalStore';
import useCartStore from '../../../zustand/public/course/cartStore';

// Custom hook untuk deteksi mobile
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < breakpoint);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

function getPriceDisplay(price, discount, type_discount) {
  if (typeof price !== 'number' || isNaN(price)) return 0;
  if (price <= 0) return 0;
  if (!discount || !type_discount) return price;
  if (type_discount === 'percent') {
    const percent = discount / 100;
    return Math.max(0, Math.round(price * (1 - percent)));
  }
  if (type_discount === 'nominal') {
    return Math.max(0, price - discount);
  }
  return price;
}

function getPriceLabel(price, discount, type_discount) {
  if (typeof price !== 'number' || isNaN(price)) {
    return <span className="text-gray-400">Tidak tersedia</span>;
  }
  if (price <= 0) {
    return <span className="text-green-600 font-bold">Gratis</span>;
  }
  if (!discount || !type_discount) {
    return <span className="font-bold">Rp {price.toLocaleString('id-ID')}</span>;
  }
  const finalPrice = getPriceDisplay(price, discount, type_discount);
  return <span className="font-bold">Rp {finalPrice.toLocaleString('id-ID')}</span>;
}

export default function CourseCart() {
  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Ambil data cart dari store
  const { cartItems, loading, error, fetchCart, removeFromCart } = useCartStore();

  React.useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Keranjang', path: location.pathname },
  ];

  const handleCheckout = () => {
    if (cartItems.length > 0) navigate('/keranjang/checkout');
  };

  const handleRemove = (id) => {
    openConfirmationModal({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus kursus ini dari keranjang?',
      variant: 'danger',
      onConfirm: async () => {
        await removeFromCart(id);
      },
      onCancel: () => {},
    });
  };

  // Untuk ringkasan
  const totalHarga = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalDiskon = cartItems.reduce((sum, item) => sum + (item.discount || 0), 0);
  const totalSetelahDiskon = cartItems.reduce(
    (sum, item) => sum + getPriceDisplay(item.price, item.discount, item.type_discount),
    0
  );
  const ppn = Math.round(totalSetelahDiskon * 0.12);
  const grandTotal = totalSetelahDiskon + ppn;

  // Komponen daftar mobile & desktop serasi dengan checkout
  function CartList() {
    return (
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border rounded-lg p-2 bg-white shadow-sm"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <div className="flex-1 flex flex-col justify-between">
              <button
                onClick={() => navigate('/kursus/' + item.id)}
                className="font-semibold text-base text-primary-800 text-left hover:underline"
              >
                {item.title}
              </button>
              <div className="mt-1">
                {getPriceLabel(item.price, item.discount, item.type_discount)}
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="bg-red-500 hover:bg-red-700 text-white rounded-md p-2 h-fit self-start"
              title="Hapus dari keranjang"
              style={{ aspectRatio: '1 / 1' }}
            >
              <Icon type="trash" className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Komponen ringkasan belanja (serasi dengan checkout)
  function CartSummary() {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-md p-4 sm:p-6 sticky md:top-[88px] z-10">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-primary-700">
          Ringkasan Belanja
        </h2>
        <div className="flex flex-col gap-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Total Kursus</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Diskon</span>
            <span className="text-green-600">- Rp {totalDiskon.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>PPN 12%</span>
            <span className="text-red-600">+ Rp {ppn.toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Total Bayar</span>
            <span className="font-bold text-lg ">
              {grandTotal === 0 ? 'Gratis' : `Rp ${grandTotal.toLocaleString('id-ID')}`}
            </span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className={`w-full py-2 sm:py-3 mt-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
            cartItems.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 shadow'
          }`}
        >
          Checkout
        </button>
      </div>
    );
  }

  return (
    <Template activeNav="keranjang" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-4 px-2 pt-6 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-700 mb-4">
          Keranjang
        </h1>
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mt-4">
          {/* Daftar Keranjang */}
          <div className="flex-1 w-full md:w-1/2">
            {loading ? (
              <div className="text-center text-gray-500 py-16">
                <Icon type="spinner" className="mx-auto w-10 h-10 animate-spin mb-4" />
                <p className="text-lg">Memuat keranjang...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-16">
                <Icon type="exclamation" className="mx-auto w-10 h-10 mb-4" />
                <p className="text-lg">{error}</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-start text-gray-500 py-4">
                <p className="text-lg">Keranjang kamu kosong.</p>
              </div>
            ) : (
              <CartList />
            )}
          </div>
          {/* Ringkasan & Checkout */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {cartItems.length > 0 && <CartSummary />}
          </div>
        </div>
      </main>
    </Template>
  );
}
