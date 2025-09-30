import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Template from '../../../../../template/template';
import Breadcrumb from '../../../../../components/breadcrumb/breadcrumb';
import Checkout from './checkout';
import Icon from '../../../../../components/icons/icon';
import useCheckoutStore from '../../../../../zustand/public/course/checkoutStore';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';
import useEnrollmentStore from '../../../../../zustand/public/course/enrollmentStore';
import { toast } from 'react-toastify';

function loadMidtransScript() {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve();
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function BuyNowCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { checkoutData, checkoutLoading, checkoutError, fetchCheckout } = useCheckoutStore();

  useEffect(() => {
    if (courseId) fetchCheckout({ courseId });
    // eslint-disable-next-line
  }, [courseId]);

  // Tambahkan useEffect untuk handle already_enrolled
  useEffect(() => {
    if (checkoutData?.already_enrolled) {
      navigate(`/kursus/${courseId}`);
    }
    // eslint-disable-next-line
  }, [checkoutData, courseId, navigate]);

  const breadcrumbItems = [
    { label: 'Tanamin Course', path: '/beranda' },
    { label: 'Kursus', path: `/kursus/${courseId}` },
    { label: 'Beli Sekarang', path: location.pathname },
  ];

  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);
  const { buyNow, loading: enrollLoading } = useEnrollmentStore();

  const onPay = () => {
    openConfirmationModal({
      title: 'Konfirmasi Pembelian',
      message: 'Apakah Anda yakin ingin membeli kursus ini?',
      variant: 'primary',
      onConfirm: async () => {
        try {
          const res = await buyNow(courseId);
          if (res?.data?.redirect_url) {
            await loadMidtransScript();
            window.snap.pay(res.data.redirect_url.split('/').pop(), {
              onSuccess: function () {
                toast.success('Pembayaran berhasil!');
                window.location.reload();
              },
              onPending: function () {
                toast.info('Pembayaran sedang diproses.');
                window.location.reload();
              },
              onError: function () {
                toast.error('Pembayaran gagal.');
              },
              onClose: function () {},
            });
          } else if (res?.status === 'success') {
            toast.success(res?.message || 'Kursus berhasil diakses.');
            navigate(`/kursus/${courseId}`);
          } else {
            toast.error(res?.message || 'Gagal mendapatkan link pembayaran');
          }
        } catch (err) {
          toast.error(err?.message || 'Gagal melakukan pembelian');
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <Template activeNav="course.course" locationKey={location.key}>
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
        {checkoutLoading && (
          <div className="flex justify-center items-center py-12">
            <span>Loading...</span>
          </div>
        )}
        {checkoutError && (
          <div className="flex flex-col items-center py-8">
            <div className="text-red-500 text-center mb-4">{checkoutError}</div>
          </div>
        )}
        {!checkoutError && checkoutData && (
          <Checkout
            benefit={checkoutData.benefit}
            course={{
              title: checkoutData.detail_course_checkout.title,
              total: checkoutData.total,
              price: checkoutData.detail_course_checkout.price,
              discount: (() => {
                const { price, discount_value, discount_type, is_discount_active } =
                  checkoutData.detail_course_checkout;
                if (!is_discount_active) return 0;
                if (discount_type === 'percent') {
                  return Math.round((discount_value / 100) * price);
                }
                if (discount_type === 'nominal') {
                  return discount_value;
                }
                return 0;
              })(),
              image: checkoutData.detail_course_checkout.image,
              coupon: checkoutData.coupon_usage,
            }}
            couponUsage={checkoutData.coupon_usage}
            backendTotal={checkoutData.total}
            ppn={checkoutData.ppn}
            grandTotal={checkoutData.grand_total}
            onPay={onPay}
            enrollLoading={enrollLoading}
          />
        )}
      </main>
    </Template>
  );
}
