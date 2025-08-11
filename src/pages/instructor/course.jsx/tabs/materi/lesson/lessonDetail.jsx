import React, { useEffect } from 'react';
import Icon from '../../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import WysiwygContent from '../../../../../../components/content/wysiwyg/WysiwygContent';
import useLessonStore from '../../../../../../zustand/material/lessonStore';
import InstructorTemplate from '../../../../../../template/templateInstructor';

export default function LessonDetail() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { lessonData, loading, error, fetchLessonDetail } = useLessonStore();

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetail(lessonId).catch((e) => {
        console.error('Error in fetchLessonDetail:', e.message);
      });
    }
  }, [lessonId, fetchLessonDetail]);

  const getVisibleValue = () => {
    if (
      lessonData?.type === 'material' &&
      lessonData?.content &&
      typeof lessonData?.content?.visible !== 'undefined'
    ) {
      if (lessonData.content.visible === 1) return 'Ya';
      if (lessonData.content.visible === 0) return 'Tidak';
      return 'N/A';
    }
    return null;
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="wf-full bg-white p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary-700">
            Detail{' '}
            {lessonData?.type === 'quiz' ? 'Quiz' : lessonData?.type === 'material' ? 'Materi' : ''}
          </h2>
          <button
            className="p-2 px-4 rounded-md flex bg-tertiary-600 text-white gap-2"
            onClick={() => navigate(`/instruktur/materi/${lessonId}/edit`)}
          >
            <Icon type={'edit'} className={'w-3 h-3'} /> Edit
          </button>
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            <p>Error: {error}</p>
          </div>
        )}
        {loading && (
          <div className="text-gray-500 mb-4">
            <p>Loading lesson data...</p>
          </div>
        )}
        {lessonData && (
          <>
            <div className="flex flex-col mb-4">
              <p className="text-primary-800 text-sm font-semibold">Materi :</p>
              <h3 className="text-lg font-bold text-secondary-8">
                {lessonData?.lesson_title || 'N/A'}
              </h3>
            </div>
            <div className="flex flex-col mb-4">
              <p className="text-primary-800 text-sm font-semibold">Modul :</p>
              <h3 className="text-lg font-bold text-secondary-8">
                {lessonData?.module_title || 'N/A'}
              </h3>
            </div>

            {lessonData?.type === 'material' &&
              typeof lessonData?.content?.visible !== 'undefined' && (
                <div className="flex flex-col mb-4">
                  <p className="text-primary-800 text-sm font-semibold">
                    Tampil pada pengguna umum :
                  </p>
                  <h3 className="text-lg font-bold text-secondary-8">{getVisibleValue()}</h3>
                </div>
              )}

            {lessonData?.type === 'material' && (
              <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <WysiwygContent html={lessonData?.content?.material || ''} />
              </div>
            )}

            {lessonData?.type === 'quiz' && Array.isArray(lessonData?.content) && (
              <div className="flex flex-col gap-6">
                {lessonData.content.map((quiz, index) => (
                  <div key={quiz.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="flex font-semibold text-lg mb-2">Quiz {index + 1}</h4>
                    <div className="w-full h-fit">
                      <WysiwygContent html={quiz?.question || ''} />
                    </div>
                    <div className="mt-4">
                      <p className="">Jawaban :</p>
                      <ul className="list-disc pl-6">
                        {quiz?.options?.map((opt, optIndex) => (
                          <li
                            key={optIndex}
                            className={`${
                              opt?.is_correct === 1 ? 'font-bold text-green-600' : 'text-gray-800'
                            }`}
                          >
                            {opt?.answer || 'N/A'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </InstructorTemplate>
  );
}
