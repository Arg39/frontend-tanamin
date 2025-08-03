import React, { useRef, useState, useEffect } from 'react';

export default function WysiwygContent({ html, maxHeight }) {
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    if (!maxHeight) return;
    const el = contentRef.current;
    if (el) {
      setClamped(el.scrollHeight > maxHeight);
    }
  }, [html, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="text-md text-black leading-relaxed wysiwyg-content transition-all duration-300"
        style={
          maxHeight && !expanded ? { maxHeight, overflow: 'hidden', position: 'relative' } : {}
        }
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
          .wysiwyg-content blockquote {
            border-left: 4px solid #3b82f6;
            margin-left: 0;
            margin-right: 0;
            padding-left: 1em;
            color: #374151;
            background: #f0f6ff;
            font-style: normal;
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
            box-sizing: border-box;
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

          /* Fix emoji vertical alignment */
          .wysiwyg-content .ap,
          .wysiwyg-content .ql-emojiblot {
            vertical-align: middle !important;
            line-height: 1 !important;
            display: inline !important;
          }

          /* --- MOBILE RESPONSIVE --- */
          @media (max-width: 640px) {
            .wysiwyg-content {
              font-size: 0.98rem;
            }
            .wysiwyg-content img {
              max-width: 100vw;
              width: 100%;
              height: auto;
              margin: 1em 0;
              padding: 4px;
              box-sizing: border-box;
              border-radius: 6px;
              box-shadow: 0 1px 4px rgba(0,0,0,0.06);
            }
            .wysiwyg-content img.ql-align-left,
            .wysiwyg-content img.ql-align-right {
              float: none;
              display: block;
              margin: 1em auto;
            }
            .wysiwyg-content pre.ql-syntax {
              font-size: 0.92em;
              padding: 8px;
            }
          }
        `}
      </style>
      {maxHeight && !expanded && clamped && (
        <>
          <div
            className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 80%)',
            }}
          />
          <button
            className="absolute left-0 bottom-0 mb-2 ml-2 px-4 py-2 bg-primary-700 text-white rounded-md text-sm font-medium shadow-lg hover:bg-primary-800 transition-colors z-10"
            style={{ width: 'fit-content' }}
            onClick={() => setExpanded(true)}
          >
            Baca selengkapnya...
          </button>
        </>
      )}
    </div>
  );
}
