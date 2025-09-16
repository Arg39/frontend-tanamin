import { useState } from 'react';
import WysiwygContent from '../../../../../../components/content/wysiwyg/WysiwygContent';
import Icon from '../../../../../../components/icons/icon';

export default function AnsweredQuiz({ data, onNextLesson, hasNextLesson, onSaveProgressAndNext }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const quizItems = Array.isArray(data?.content) ? data.content : [];
  const score = data?.score ?? 0;

  return (
    <div className="w-full md:min-w-[600px] min-h-[300px] md:min-h-[600px] p-4 md:p-8 border border-primary-700 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-2">
        <p className="flex-1 text-start text-2xl font-bold">{data?.lesson_title}</p>
        {hasNextLesson && (
          <button
            className="flex items-center gap-2 bg-primary-700 text-white px-4 py-1 rounded-lg font-semibold hover:bg-primary-800 transition md:ml-4"
            onClick={onSaveProgressAndNext ? onSaveProgressAndNext : onNextLesson}
          >
            Next
            <Icon type="arrow-right" className="w-4 h-4 inline-block ml-1" />
          </button>
        )}
      </div>
      {!showAnswers ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl font-bold mb-2">Quiz sudah dikerjakan!</p>
          <p className="mb-4">
            Nilai Anda: <span className="font-bold text-primary-700">{score}</span>
          </p>
          <button
            className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition"
            onClick={() => setShowAnswers(true)}
          >
            Lihat Jawaban
          </button>
        </div>
      ) : (
        <div>
          {quizItems.map((quiz, idx) => {
            const options = Object.entries(quiz.answer || {}).map(([key, obj]) => ({
              id: obj.id,
              label: obj.answer,
              isCorrect: obj.is_correct === true,
            }));
            const userAnswerId = quiz.user_answer;
            return (
              <div key={quiz.id || idx} className="mb-6">
                <p className="mb-2 text-lg font-semibold">
                  Question {idx + 1} of {quizItems.length}
                </p>
                <WysiwygContent html={quiz.quiz || ''} />
                <div className="flex flex-col gap-2 mt-2">
                  {options.map((opt) => {
                    // Highlight logic
                    let labelClass = 'border-gray-300';
                    if (opt.id === userAnswerId) {
                      labelClass = quiz.is_correct
                        ? 'bg-green-100 border-green-700'
                        : 'bg-red-100 border-red-700';
                    } else if (opt.isCorrect) {
                      labelClass = 'bg-green-50 border-green-400';
                    }
                    return (
                      <label
                        key={opt.id}
                        className={`border rounded-lg px-4 py-2 flex items-center gap-2 ${labelClass}`}
                      >
                        <input
                          type="radio"
                          checked={opt.id === userAnswerId}
                          readOnly
                          className="mr-2"
                        />
                        {opt.label}
                        {opt.isCorrect && (
                          <span className="ml-2 text-green-600 font-bold text-xs">
                            (Jawaban Benar)
                          </span>
                        )}
                        {opt.id === userAnswerId && !opt.isCorrect && (
                          <span className="ml-2 text-red-600 font-bold text-xs">
                            (Jawaban Anda)
                          </span>
                        )}
                        {opt.id === userAnswerId && opt.isCorrect && (
                          <span className="ml-2 text-green-600 font-bold text-xs">
                            (Jawaban Anda & Benar)
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button
            className="w-full bg-primary-700 text-white px-4 py-1 rounded-lg font-semibold mt-4 hover:bg-primary-800 transition"
            onClick={() => setShowAnswers(false)}
          >
            Tutup Jawaban
          </button>
        </div>
      )}
    </div>
  );
}
