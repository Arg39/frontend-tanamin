import React from 'react';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';

export default function MaterialContentCourse({ data }) {
  return (
    <div className="min-h-[600px] p-4 border border-primary-700 rounded-lg mb-4">
      <p className="w-full flex justify-center text-xl font-bold mb-4">{data?.lesson_title}</p>
      <WysiwygContent html={data?.content?.material || ''} />
    </div>
  );
}
