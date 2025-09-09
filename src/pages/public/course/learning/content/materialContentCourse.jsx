import React from 'react';
import WysiwygContent from '../../../../../components/content/wysiwyg/WysiwygContent';

export default function MaterialContentCourse({ content }) {
  return (
    <div>
      <WysiwygContent html={content || ''} />
    </div>
  );
}
