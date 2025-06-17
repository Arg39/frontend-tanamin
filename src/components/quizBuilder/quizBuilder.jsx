import React from 'react';
import QuizQuestion from './quizQuestion';

export default function QuizBuilder({ questions, setQuestions }) {
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index, updated) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, index) => (
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
