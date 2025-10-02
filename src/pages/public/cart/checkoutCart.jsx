import React, { useEffect } from 'react';
import Template from '../../../template/template';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import Icon from '../../../components/icons/icon';
import Checkout from '../course/detailCourse/butNow/checkout';
import useCheckoutStore from '../../../zustand/public/course/checkoutStore';
import useEnrollmentStore from '../../../zustand/public/course/enrollmentStore';
import { toast } from 'react-toastify';

function loadMidtransScript() {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_FRONTEND_INTEGRATION_MIDTRANS;
    script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function CheckoutChart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId || ''}` },
    { label: 'Beli Sekarang', path: location.pathname },
  ];

  const { checkoutCartData, checkoutCartLoading, checkoutCartError, fetchCheckoutCart } =
    useCheckoutStore();

  const { checkoutCart, loading: enrollLoading } = useEnrollmentStore();

  useEffect(() => {
    fetchCheckoutCart();
    // eslint-disable-next-line
  }, []);

  // Handler for payment
  const onPay = async () => {
    try {
      const res = await checkoutCart();
      if (res?.data?.redirect_url) {
        await loadMidtransScript();
        const redirectUrl = res.data.redirect_url;
        const token = redirectUrl.split('/').pop();
        if (window.snap && token) {
          window.snap.pay(token, {
            onSuccess: function () {
              toast.success('Pembayaran berhasil!');
              navigate('/kursus');
            },
            onPending: function () {
              toast.info('Pembayaran sedang diproses.');
              navigate('/kursus');
            },
            onError: function () {
              toast.error('Pembayaran gagal.');
            },
            onClose: function () {},
          });
        } else {
          toast.error('Gagal memproses pembayaran (token tidak ditemukan)');
        }
      } else if (res?.status === 'success') {
        toast.success(res?.message || 'Pembayaran berhasil.');
        navigate('/kursus');
      } else {
        toast.error(res?.message || 'Gagal mendapatkan link pembayaran');
      }
    } catch (err) {
      toast.error(err?.message || 'Gagal melakukan pembayaran');
    }
  };

  return (
    <Template activeNav="keranjang" locationKey={location.key}>
      <main className="min-h-screen bg-white xl:px-24 lg:px-16 md:px-10 sm:px-6 px-4 pt-8 w-full mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <button
          type="button"
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4 text-white" />
          <span>Kembali</span>
        </button>
        {checkoutCartLoading && (
          <div className="flex justify-center items-center py-12">
            <span>Loading...</span>
          </div>
        )}
        {checkoutCartError && (
          <div className="flex flex-col items-center py-8">
            <div className="text-red-500 text-center mb-4">{checkoutCartError}</div>
          </div>
        )}
        {!checkoutCartLoading && !checkoutCartError && checkoutCartData && (
          <Checkout
            multiple={true}
            benefit={checkoutCartData.benefit}
            courses={checkoutCartData.courses.map((c) => ({
              title: c.title,
              total: c.price_after_discount,
              price: c.base_price,
              discount: c.discount,
              image: c.image,
            }))}
            backendTotal={checkoutCartData.total}
            ppn={checkoutCartData.ppn}
            grandTotal={checkoutCartData.grand_total}
            onPay={onPay}
            enrollLoading={enrollLoading}
          />
        )}
      </main>
    </Template>
  );
}
