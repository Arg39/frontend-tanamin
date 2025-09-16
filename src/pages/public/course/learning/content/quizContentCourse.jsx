import StartAttemptQuiz from './quiz/startAttemptQuiz';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';
import AnsweredQuiz from './quiz/answeredQuiz';

export default function QuizContentCourse({
  data,
  onSubmitAnswers,
  submitLoading,
  submitError,
  submitStatus,
  onNextLesson,
  hasNextLesson,
  onSaveProgressAndNext,
  reloadQuizLesson,
}) {
  // If already attempted, show AnsweredQuiz
  if (data?.attempt) {
    return (
      <AnsweredQuiz
        data={data}
        onNextLesson={onNextLesson}
        hasNextLesson={hasNextLesson}
        onSaveProgressAndNext={onSaveProgressAndNext}
      />
    );
  }

  const quizItems = Array.isArray(data?.content) ? data.content : [];
  return (
    <StartAttemptQuiz
      lesson_title={data?.lesson_title}
      quizItems={quizItems}
      onSubmitAnswers={onSubmitAnswers}
      submitLoading={submitLoading}
      submitError={submitError}
    />
  );
}
