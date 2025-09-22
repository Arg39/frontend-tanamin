import React, { useState, useEffect } from 'react';
import useCertificateStore from '../../../../../zustand/public/course/learning/certificateStore';
import useReviewCourseStore from '../../../../../zustand/public/course/reviewCourseStore';
import Icon from '../../../../../components/icons/icon';
import TextInput from '../../../../../components/form/textInput';
import { toast } from 'react-toastify';

export default function CertificateContentCourse({ data, loading, error, onNextLesson }) {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const { downloadCertificatePdf } = useCertificateStore();

  // Review state
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Review store
  const {
    loading: reviewLoading,
    error: reviewError,
    review,
    fetchReview,
    submitReview,
  } = useReviewCourseStore();

  useEffect(() => {
    if (data?.course_id) {
      fetchReview(data.course_id).catch(() => {});
    }
    // eslint-disable-next-line
  }, [data?.course_id]);

  const handleDownload = async () => {
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      await downloadCertificatePdf(data?.certificate_code);
    } catch (e) {
      setDownloadError(e.message || 'Gagal mengunduh sertifikat');
      toast.error(e.message || 'Gagal mengunduh sertifikat');
    }
    setDownloadLoading(false);
  };

  // Handle star click
  const handleStarClick = (star) => {
    setReviewStars(star);
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setReviewComment(e.target.value);
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (reviewStars === 0) {
      toast.error('Silakan pilih rating bintang.');
      return;
    }
    // comment nullable, but let's keep UX
    if (reviewComment.length > 1000) {
      toast.error('Komentar maksimal 1000 karakter.');
      return;
    }

    try {
      await submitReview(data.course_id, reviewStars, reviewComment);
      toast.success('Review berhasil dikirim. Terima kasih!');
      setReviewComment('');
      setReviewStars(0);
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim review.');
    }
  };

  return (
    <div className="w-full min-h-[600px] p-8 border border-primary-700 rounded-lg mb-4 flex flex-col items-center justify-center">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : !data ? (
        <div>Belum ada sertifikat.</div>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="bg-white border-4 border-primary-700 rounded-xl shadow-lg p-4 md:p-8 w-full text-center">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Sertifikat Penyelesaian</h2>
            <p className="text-lg mb-2">Diberikan kepada:</p>
            <p className="text-2xl font-bold mb-4">{data.user_name || 'Nama User'}</p>
            <p className="mb-2">Atas penyelesaian kursus:</p>
            <p className="text-xl font-semibold mb-4">{data.course_title || 'Nama Kursus'}</p>
            <p className="mb-2">Tanggal: {data.issued_at ? data.issued_at.split(' ')[0] : '-'}</p>
            <p className="mb-4">Kode Sertifikat: {data.certificate_code}</p>
            <button
              className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition disabled:opacity-50"
              onClick={handleDownload}
              disabled={loading || downloadLoading}
            >
              {loading || downloadLoading ? 'Mengunduh...' : 'Download Sertifikat'}
            </button>
          </div>

          {/* content for review course */}
          <div className="bg-white border-4 border-primary-700 rounded-xl shadow-lg p-4 md:p-8 w-full text-center">
            <h3 className="text-xl font-bold text-primary-700 mb-4">Review Kursus</h3>
            {reviewLoading ? (
              <div>Mengambil data review...</div>
            ) : reviewError ? (
              <div className="text-red-500">{reviewError}</div>
            ) : review ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      type="star"
                      className={`size-6 ${
                        star <= (review.rating || review.stars)
                          ? 'text-tertiary-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-lg font-semibold">{review.comment}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {review.created_at ? `Dikirim pada ${review.created_at.split(' ')[0]}` : ''}
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4 text-secondary-700">
                  Mohon berikan penilaian bintang untuk kursus ini untuk membantu kami meningkatkan
                  kualitas pembelajaran.
                </p>
                <form
                  onSubmit={handleReviewSubmit}
                  className="w-full flex flex-col items-center gap-4"
                >
                  <div className="w-full flex items-center justify-center gap-4 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                        aria-label={`Beri rating ${star} bintang`}
                      >
                        <Icon
                          type="star"
                          className={`size-7 transition ${
                            star <= reviewStars ? 'text-tertiary-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="w-full">
                    <TextInput
                      name="reviewComment"
                      value={reviewComment}
                      onChange={handleCommentChange}
                      placeholder="Tulis komentar Anda tentang kursus ini..."
                      textarea
                      rows={3}
                      disabled={reviewLoading}
                      maxLength={1000}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition disabled:opacity-50 mt-2"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Mengirim...' : 'Kirim Review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
