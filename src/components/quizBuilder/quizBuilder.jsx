import React, { forwardRef, useImperativeHandle } from 'react';
import QuizQuestion from './quizQuestion';

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

const QuizBuilder = forwardRef(function QuizBuilder({ quizContent, setQuizContent }, ref) {
  const addQuestion = () => {
    setQuizContent([
      ...quizContent,
      { question: '', options: ['', '', '', ''], correctAnswer: null },
    ]);
  };

  const updateQuestion = (index, updated) => {
    const newQuizContent = [...quizContent];
    newQuizContent[index] = updated;
    setQuizContent(newQuizContent);
  };

  const deleteQuestion = (index) => {
    const newQuizContent = quizContent.filter((_, idx) => idx !== index);
    setQuizContent(newQuizContent);
  };

  // Validation exposed to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!quizContent.length) {
        return { valid: false, reason: 'empty' };
      }
      const invalidDetails = [];
      quizContent.forEach((q, idx) => {
        const questionInvalid = !stripHtml(q.question);
        const optionInvalidIndices = q.options.map((opt) => !opt || !opt.trim());
        const correctAnswerInvalid = q.correctAnswer === null || q.correctAnswer === undefined;
        if (questionInvalid || optionInvalidIndices.some(Boolean) || correctAnswerInvalid) {
          invalidDetails.push({
            index: idx,
            questionInvalid,
            optionInvalidIndices,
            correctAnswerInvalid,
          });
        }
      });
      if (invalidDetails.length) {
        return {
          valid: false,
          reason: 'incomplete',
          invalid: invalidDetails,
        };
      }
      return { valid: true };
    },
  }));

  return (
    <div className="flex flex-col gap-4">
      {quizContent.map((q, index) => {
        const questionInvalid = !stripHtml(q.question);
        const optionInvalidIndices = q.options.map((opt) => !opt || !opt.trim());
        const correctAnswerInvalid = q.correctAnswer === null || q.correctAnswer === undefined;
        return (
          <QuizQuestion
            key={index}
            index={index}
            data={q}
            validation={{
              questionInvalid,
              optionInvalidIndices,
              correctAnswerInvalid,
            }}
            onChange={(updated) => updateQuestion(index, updated)}
            onDelete={() => deleteQuestion(index)}
          />
        );
      })}
      <button
        type="button"
        className="w-fit bg-secondary-700 text-white px-4 py-2 rounded hover:bg-secondary-600"
        onClick={addQuestion}
      >
        Tambah Pertanyaan
      </button>
    </div>
  );
});

export default QuizBuilder;
