import React from 'react';

export default function WysiwygContent({ html }) {
  return (
    <>
      <div
        className="text-md text-gray-700 leading-relaxed wysiwyg-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>
        {`
          .wysiwyg-content h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #1e293b;
          }
          .wysiwyg-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #334155;
          }
          .wysiwyg-content p {
          }
          .wysiwyg-content strong {
            font-weight: bold;
          }
          .wysiwyg-content span[style] {
            padding: 0 2px;
            border-radius: 2px;
          }
        `}
      </style>
    </>
  );
}
