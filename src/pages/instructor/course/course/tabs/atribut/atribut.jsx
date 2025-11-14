import React, { useEffect } from 'react';
import Icon from '../../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import useCourseAttributeStore from '../../../../../../zustand/courseAttributeStore';
import useAuthStore from '../../../../../../zustand/authStore';

export default function CourseAttribute({ editable }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { attribute, attributeLoading, attributeError, fetchAttribute } = useCourseAttributeStore();
  const role = useAuthStore((state) => state.user.role);

  useEffect(() => {
    if (id) fetchAttribute({ id });
  }, [id, fetchAttribute]);

  // Helper to render attribute section
  const renderAttributeSection = (title, data, emptyText) => (
    <div className="bg-white-50 rounded-xl shadow p-4 mb-6">
      <p className="text-lg sm:text-xl text-primary-700 font-bold mb-3">{title}</p>
      {data && data.length > 0 && data[0].content && data[0].content.length > 0 ? (
        <ol className="list-decimal pl-5 space-y-1">
          {data[0].content.map((item, idx) => (
            <li key={idx} className="text-base text-gray-800 break-words">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-base text-gray-500">{emptyText}</p>
      )}
    </div>
  );

  return (
    <>
      {attributeLoading && <p className="text-base text-black">Loading...</p>}
      {attributeError && <p className="text-base text-red-600">{attributeError}</p>}
      {!attributeLoading && !attributeError && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <p className="text-xl sm:text-2xl font-bold text-black">Atribut Kursus</p>
            {editable &&
              role === 'instructor' &&
              (attribute?.status === 'new' || attribute?.status === 'edited') && (
                <button
                  onClick={() => navigate(`/instruktur/kursus/${id}/tambah/persyaratan-deskripsi`)}
                  className="w-full sm:w-auto bg-secondary-500 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center justify-center mt-2 md:mt-0"
                >
                  <Icon type="edit" className="mr-2" />
                  Edit
                </button>
              )}
          </div>

          {/* Persyaratan */}
          {renderAttributeSection(
            'Persyaratan:',
            attribute?.prerequisite,
            'Belum ada persyaratan.'
          )}

          {/* Deskripsi */}
          {renderAttributeSection('Deskripsi:', attribute?.description, 'Belum ada deskripsi.')}

          {/* Benefit */}
          {renderAttributeSection('Benefit:', attribute?.benefit, 'Belum ada benefit.')}
        </>
      )}
    </>
  );
}
