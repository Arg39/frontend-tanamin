import React, { useEffect } from 'react';
import Icon from '../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import useCourseAttributeStore from '../../../../../zustand/courseAttributeStore';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

function DeskripsiItem({ number, text, onEdit, onDelete, editable }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white-100 px-4 py-3 rounded-xl border border-primary-700 shadow-sm mb-3 transition-all">
      <div className="flex items-start gap-2 w-full sm:w-auto">
        <span className="font-semibold text-primary-700">{number}.</span>
        <span className="break-words text-base text-gray-800">{text}</span>
      </div>
      {editable && (
        <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none bg-primary-700 text-white-100 px-4 py-1.5 rounded-lg hover:bg-primary-800 transition font-medium text-sm"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="flex-1 sm:flex-none bg-red-700 text-white-100 px-4 py-1.5 rounded-lg hover:bg-red-800 transition font-medium text-sm"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function CourseAttribute({ editable }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { attribute, attributeLoading, attributeError, fetchAttribute, deleteAttribute } =
    useCourseAttributeStore();

  useEffect(() => {
    if (id) fetchAttribute({ id });
  }, [id, fetchAttribute]);

  const { openModal, closeModal } = useConfirmationModalStore();

  // Handler for deleting prerequisite or description
  const handleDelete = (id_info, type) => {
    openModal({
      title: 'Konfirmasi Hapus',
      message: 'Yakin ingin menghapus item ini?',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteAttribute({ courseId: id, attributeId: id_info, type });
        if (res.status === 'success') {
          fetchAttribute({ id });
          toast.success('Berhasil menghapus data');
        } else {
          toast.error(res.message || 'Gagal menghapus data');
        }
        closeModal();
      },
      onCancel: closeModal,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <p className="text-xl sm:text-2xl font-bold text-primary-800">Atribut Kursus</p>
        {editable && (
          <button
            onClick={() => navigate(`/instruktur/kursus/${id}/tambah/persyaratan-deskripsi`)}
            className="w-full sm:w-auto bg-primary-700 text-white-100 px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center justify-center mt-2 md:mt-0"
          >
            <Icon type="plus" className="mr-2" />
            Tambah
          </button>
        )}
      </div>

      {attributeLoading && <p className="text-base text-gray-500">Loading...</p>}
      {attributeError && <p className="text-base text-red-600">{attributeError}</p>}
      {!attributeLoading && !attributeError && (
        <>
          {/* Persyaratan */}
          <div className="bg-white-50 rounded-xl shadow p-4 mb-6">
            <p className="text-lg sm:text-xl text-tertiary-600 font-bold mb-3">Persyaratan:</p>
            {attribute && attribute.prerequisite && attribute.prerequisite.length > 0
              ? attribute.prerequisite.map((item, idx) => (
                  <DeskripsiItem
                    key={item.id}
                    number={idx + 1}
                    text={item.content}
                    editable={editable}
                    onEdit={() =>
                      navigate(`/instruktur/kursus/${id}/edit/persyaratan-deskripsi/${item.id}`)
                    }
                    onDelete={() => handleDelete(item.id, 'prerequisite')}
                  />
                ))
              : !attributeLoading && (
                  <p className="text-base text-gray-500">Belum ada persyaratan.</p>
                )}
          </div>

          {/* Deskripsi */}
          <div className="bg-white-50 rounded-xl shadow p-4">
            <p className="text-lg sm:text-xl text-tertiary-600 font-bold mb-3">Deskripsi:</p>
            <div className="flex flex-col gap-2">
              {attribute && attribute.description && attribute.description.length > 0
                ? attribute.description.map((item, idx) => (
                    <DeskripsiItem
                      key={item.id}
                      number={idx + 1}
                      text={item.content}
                      editable={editable}
                      onEdit={() =>
                        navigate(`/instruktur/kursus/${id}/edit/persyaratan-deskripsi/${item.id}`)
                      }
                      onDelete={() => handleDelete(item.id, 'description')}
                    />
                  ))
                : !attributeLoading && (
                    <p className="text-base text-gray-500">Belum ada deskripsi.</p>
                  )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
