import React from 'react';
import QuizQuestion from './quizQuestion';

export default function QuizBuilder({ quizContent, setQuizContent }) {
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

  return (
    <div className="flex flex-col gap-4">
      {quizContent.map((q, index) => (
        <QuizQuestion
          key={index}
          index={index}
          data={q}
          onChange={(updated) => updateQuestion(index, updated)}
          onDelete={() => deleteQuestion(index)}
        />
      ))}
      <button
        type="button"
        className="w-fit bg-secondary-700 text-white-100 px-4 py-2 rounded hover:bg-secondary-600"
        onClick={addQuestion}
      >
        Tambah Pertanyaan
      </button>
    </div>
  );
}
