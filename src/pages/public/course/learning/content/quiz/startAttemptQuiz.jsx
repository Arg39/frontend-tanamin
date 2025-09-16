import { useState } from 'react';
import WysiwygContent from '../../../../../../components/content/wysiwyg/WysiwygContent';

export default function StartAttemptQuiz({
  lesson_title,
  quizItems,
  onSubmitAnswers,
  submitLoading,
  submitError,
}) {
  const [started, setStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleStart = () => setStarted(true);

  const handleSelect = (questionIdx, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionId,
    }));
  };

  const handleFinish = async () => {
    const answer = quizItems.map((quiz, idx) => ({
      [quiz.id]: selectedAnswers[idx],
    }));
    if (onSubmitAnswers) {
      await onSubmitAnswers(answer);
    }
  };

  const allAnswered =
    quizItems.length > 0 && quizItems.every((_, idx) => selectedAnswers[idx] !== undefined);

  if (!started) {
    return (
      <div className="w-full md:min-w-[600px] min-h-[300px] md:min-h-[600px] flex flex-col items-center justify-start h-64 p-4 md:p-8 border border-primary-700 rounded-lg mb-4">
        <div className="flex items-center justify-between w-full mb-4">
          <p className="flex-1 text-start text-2xl font-bold">{lesson_title}</p>
        </div>
        <div className="w-full flex flex-col items-center justify-center h-64">
          <p className="mb-4 text-lg">Siap mulai test?</p>
          <button
            className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition"
            onClick={handleStart}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:min-w-[600px] min-h-[300px] md:min-h-[600px] p-4 md:p-8 border border-primary-700 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-8">
        <p className="flex-1 text-start text-2xl font-bold">{lesson_title}</p>
      </div>
      {quizItems.map((quiz, idx) => {
        const options = Object.entries(quiz.answer || {}).map(([, obj]) => ({
          id: obj.id,
          label: obj.answer,
        }));
        return (
          <div key={quiz.id || idx} className="mb-6">
            <p className="mb-2 text-lg font-semibold">
              Question {idx + 1} of {quizItems.length}
            </p>
            <WysiwygContent html={quiz.quiz || ''} />
            <div className="flex flex-col gap-2">
              {options.map((opt) => (
                <label
                  key={opt.id}
                  className={`border rounded-lg px-4 py-2 cursor-pointer ${
                    selectedAnswers[idx] === opt.id
                      ? 'bg-primary-100 border-primary-700'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`quiz-option-${idx}`}
                    checked={selectedAnswers[idx] === opt.id}
                    onChange={() => handleSelect(idx, opt.id)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        );
      })}
      <button
        className={`w-full bg-primary-700 text-white px-4 py-1 rounded-lg font-semibold ${
          !allAnswered || submitLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary-800 transition'
        }`}
        onClick={handleFinish}
        disabled={!allAnswered || submitLoading}
      >
        {submitLoading ? 'Submitting...' : 'Finish'}
      </button>
      {submitError && <div className="mt-4 text-red-500 text-center">{submitError}</div>}
    </div>
  );
}
