import React from 'react';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';
import Icon from '../../../../../components/icons/icon';

export default function MaterialContentCourse({
  data,
  onNextLesson,
  hasNextLesson,
  onSaveProgressAndNext,
}) {
  return (
    <div className="min-h-[600px] p-4 border border-primary-700 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-8">
        <p className="flex-1 text-start text-2xl font-bold">{data?.lesson_title}</p>
        {hasNextLesson && (
          <button
            className="flex items-center gap-2 bg-primary-700 text-white px-4 py-1 rounded-lg font-semibold hover:bg-primary-800 transition ml-4"
            onClick={onSaveProgressAndNext ? onSaveProgressAndNext : onNextLesson}
          >
            Next
            <Icon type="arrow-right" className="w-4 h-4 inline-block ml-1" />
          </button>
        )}
      </div>
      <WysiwygContent html={data?.content?.material || ''} />
    </div>
  );
}
