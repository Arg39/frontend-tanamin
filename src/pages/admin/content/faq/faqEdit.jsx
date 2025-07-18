import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import Icon from '../../../../components/icons/icon';
import TextInput from '../../../../components/form/textInput';
import { toast } from 'react-toastify';
import useConfirmationModalStore from '../../../../zustand/confirmationModalStore';
import useFaqStore from '../../../../zustand/faqStore';

export default function FaqEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useConfirmationModalStore();
  const { fetchFaqById, updateFaq, loading } = useFaqStore();

  const breadcrumbItems = [
    { label: 'FAQ', path: '/admin/faq' },
    { label: 'Edit FAQ', path: location.pathname },
  ];

  const [form, setForm] = useState({
    question: '',
    answer: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFaqById(id);
        setForm({
          question: data.question || '',
          answer: data.answer || '',
        });
      } catch (error) {
        toast.error(error.message || 'Gagal mengambil data FAQ');
        navigate(-1);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    openModal({
      title: 'Konfirmasi Update',
      message: 'Apakah Anda yakin ingin mengupdate FAQ ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await updateFaq(id, form);
          toast.success('FAQ berhasil diupdate');
          navigate(-1);
        } catch (error) {
          toast.error(error.message || 'Gagal mengupdate FAQ');
        }
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <AdminTemplate activeNav={'faq'} breadcrumbItems={breadcrumbItems}>
      <form onSubmit={handleSubmit}>
        <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
          <button
            type="button"
            className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
            onClick={() => navigate(-1)}
          >
            <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
            <span>Kembali</span>
          </button>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-0">Edit FAQ</h2>
          </div>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Pertanyaan"
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Masukkan pertanyaan"
              required
              disabled={loading}
            />
            <TextInput
              label="Jawaban"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              placeholder="Masukkan jawaban"
              textarea
              required
              multiline
              rows={4}
              disabled={loading}
            />
          </div>
          <div className="wfull flex justify-end">
            <button
              type="submit"
              className="w-fit mt-4 bg-primary-700 hover:bg-primary-800 text-white px-6 py-2 rounded-md font-semibold"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Ubah'}
            </button>
          </div>
        </div>
      </form>
    </AdminTemplate>
  );
}
