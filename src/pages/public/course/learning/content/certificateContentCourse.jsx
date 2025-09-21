import React, { useState } from 'react';
import useCertificateStore from '../../../../../zustand/public/course/learning/certificateStore';
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
  const [reviewLoading, setReviewLoading] = useState(false);

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
    if (!reviewComment.trim()) {
      toast.error('Komentar tidak boleh kosong.');
      return;
    }

    setReviewLoading(true);
    try {
      // Simulate async submit (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success('Review berhasil dikirim. Terima kasih!');
      setReviewComment('');
      setReviewStars(0);
    } catch (err) {
      toast.error('Gagal mengirim review.');
    }
    setReviewLoading(false);
  };

  return (
    <div className="min-h-[600px] p-8 border border-primary-700 rounded-lg mb-4 flex flex-col items-center justify-center">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : !data ? (
        <div>Belum ada sertifikat.</div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white border-4 border-primary-700 rounded-xl shadow-lg p-8 w-full text-center">
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
          <div className="bg-white border-4 border-primary-700 rounded-xl shadow-lg p-8 w-full text-center">
            <h3 className="text-xl font-bold text-primary-700 mb-4">Review Kursus</h3>
            <form onSubmit={handleReviewSubmit} className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-1 mb-2">
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
                      color={star <= reviewStars ? '#facc15' : '#d1d5db'}
                    />
                  </button>
                ))}
              </div>
              <TextInput
                name="reviewComment"
                value={reviewComment}
                onChange={handleCommentChange}
                placeholder="Tulis komentar Anda tentang kursus ini..."
                textarea
                rows={3}
                disabled={reviewLoading}
                required
              />
              <button
                type="submit"
                className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition disabled:opacity-50 mt-2"
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
