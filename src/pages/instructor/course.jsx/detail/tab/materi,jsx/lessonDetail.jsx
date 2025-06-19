import React, { useEffect } from 'react';
import AdminTemplate from '../../../../../../template/templateAdmin';
import Icon from '../../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import WysiwygContent from '../../../../../../components/content/wysiwyg/WysiwygContent';
import QuizQuestion from '../../../../../../components/quizBuilder/quizQuestion';
import useLessonStore from '../../../../../../zustand/material/lessonStore';

export default function LessonDetail() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { lessonData, loading, error, fetchLessonDetail } = useLessonStore();

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetail(lessonId);
    }
  }, [lessonId, fetchLessonDetail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!lessonData) {
    return <div>No data available</div>;
  }

  return (
    <AdminTemplate activeNav="kursus">
      <div className="wf-full bg-white-100 p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white-100 px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">{lessonData.lesson_title}</h2>
        <h3 className="text-lg text-gray-600 mb-4">{lessonData.module_title}</h3>

        {/* Render content based on type */}
        {lessonData.type === 'material' && <WysiwygContent html={lessonData.content.material} />}

        {lessonData.type === 'quiz' && (
          <div className="flex flex-col gap-4">
            {lessonData.content.map((quiz, index) => (
              <QuizQuestion
                key={quiz.id}
                index={index}
                data={{
                  question: quiz.question,
                  options: quiz.options.map((opt) => opt.answer),
                  correctAnswer: quiz.options.findIndex((opt) => opt.is_correct === 1),
                }}
                onChange={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </AdminTemplate>
  );
}
