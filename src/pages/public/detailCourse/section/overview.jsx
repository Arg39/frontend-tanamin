import React from 'react';
import WysiwygContent from '../../../../components/content/wysiwyg/WysiwygContent';

export default function OverviewCourseDetail({ course }) {
  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg mb-6 scroll-mt-28" id="overview">
      <p className="text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
        Apa yang akan Anda pelajari
      </p>
      <WysiwygContent html={course.detail || ''} maxHeight={350} />
    </div>
  );
}
