import React from 'react';

export default function WysiwygContent({ html }) {
  return (
    <>
      <div
        className="text-md text-black-900 leading-relaxed wysiwyg-content"
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
            margin-bottom: 0.5em;
          }
          .wysiwyg-content strong {
            font-weight: bold;
            color: #0066cc;
          }
          .wysiwyg-content span[style] {
            padding: 0 2px;
            border-radius: 2px;
          }
          .wysiwyg-content ol,
          .wysiwyg-content ul {
            margin-left: 1.5em;
            padding-left: 1.5em;
          }
          .wysiwyg-content li {
          }
          .wysiwyg-content a {
            color: #2563eb;
            text-decoration: underline;
            word-break: break-all;
          }
          .wysiwyg-content img {
            max-width: 100%;
            border-radius: 8px;
            display: block;
          }
          .wysiwyg-content pre.ql-syntax {
            background: #222 !important;
            color: #fff !important;
            border-radius: 5px;
            padding: 12px;
            font-family: 'Fira Mono', 'Consolas', 'Monaco', monospace;
            font-size: 0.95em;
            overflow-x: auto;
            margin-bottom: 1em;
          }
          .wysiwyg-content u {
            text-decoration: underline;
          }
          .wysiwyg-content s {
            text-decoration: line-through;
          }

          .wysiwyg-content ol {
            list-style-type: decimal;
            padding-left: 1.5em;
          }
          .wysiwyg-content ul {
            list-style-type: disc;
            margin-left: 1.5em;
            padding-left: 1.5em;
          }
          .wysiwyg-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 1.5em auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07), 0 1.5px 4px rgba(0,0,0,0.04);
            object-fit: contain;
            background: #f8fafc;
            padding: 8px;
          }

          /* Alignment styles */
          .wysiwyg-content .ql-align-center {
            text-align: center;
          }
          .wysiwyg-content .ql-align-left {
            text-align: left;
          }
          .wysiwyg-content .ql-align-right {
            text-align: right;
          }

          .wysiwyg-content img {
            max-height: 400px;
          }
          .wysiwyg-content img.ql-align-center {
            margin: 0 auto;
          }
          .wysiwyg-content img.ql-align-left {
            margin: 0;
            float: left;
          }
          .wysiwyg-content img.ql-align-right {
            margin: 0;
            float: right;
          }
        `}
      </style>
    </>
  );
}
