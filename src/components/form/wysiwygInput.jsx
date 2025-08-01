import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useWysiwygStore from '../../zustand/wysiwyg/wysiwygStore';
import 'react-quill-emoji/dist/quill-emoji.css';
import { Quill as QuillEmoji } from 'react-quill-emoji';

// Register custom toolbar button for Note
const NoteButton = () => (
  <button
    type="button"
    className="ql-note"
    title="Note"
    style={{ fontWeight: 'bold', borderLeft: '3px solid #3b82f6', paddingLeft: 6 }}
  >
    Note
  </button>
);

// Add custom handler for Note button
function insertNote() {
  const quill = this.quill;
  const range = quill.getSelection();
  if (range) {
    quill.formatLine(range.index, range.length, 'blockquote', true);
  }
}

// Extend Quill toolbar with Note button
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      [{ align: [] }, 'bold', 'italic', 'underline', 'strike', 'emoji'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link', 'image', 'code-block'],
    ],
    handlers: {
      note: insertNote, // optional: remove if not using custom note
    },
  },
  'emoji-toolbar': true,
  'emoji-textarea': false,
  'emoji-shortname': true,
};

const WysiwygInput = forwardRef(
  ({ label, name, value, onChange, placeholder, maxImageWidth = 600, disabled = false }, ref) => {
    const quillRef = useRef(null);
    const [content, setContent] = useState(value || '');
    const uploadLocalImagesStore = useWysiwygStore((state) => state.uploadLocalImages);

    useEffect(() => {
      if ((value ?? '') !== content) {
        setContent(value ?? '');
      }
    }, [value]);

    const isEmptyContent = (html) => {
      if (!html) return true;
      const cleaned = html.replace(/\s/g, '');
      return cleaned === '<p><br></p>';
    };

    const handleChange = (html) => {
      setContent(html);
      onChange({
        target: { name, value: isEmptyContent(html) ? null : html },
      });
    };

    useEffect(() => {
      const editor = quillRef.current?.getEditor()?.root;
      if (editor) {
        editor.style.height = 'auto';
        editor.style.minHeight = '200px';
        editor.style.maxHeight = 'none';
        editor.style.overflowY = 'hidden';
        editor.style.resize = 'none';
        editor.style.boxSizing = 'border-box';
        editor.style.paddingBottom = '1px';
        editor.style.transition = 'height 0.2s';
        editor.style.height = editor.scrollHeight + 'px';
        if (disabled) {
          editor.setAttribute('contenteditable', 'false');
          editor.style.background = '#f3f4f6';
          editor.style.cursor = 'not-allowed';
        } else {
          editor.setAttribute('contenteditable', 'true');
          editor.style.background = '';
          editor.style.cursor = '';
        }
      }
      if (editor) {
        const imgs = editor.querySelectorAll('img');
        imgs.forEach((img) => {
          img.style.maxWidth = `${maxImageWidth}px`;
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '0 auto';
        });
      }
    }, [content, maxImageWidth, disabled]);

    const uploadLocalImages = async (token) => {
      const editor = quillRef.current?.getEditor();
      if (!editor) return content;
      const baseUrlRaw = process.env.REACT_APP_BACKEND_BASE_URL || '';
      const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw;
      const finalContent = await uploadLocalImagesStore({ editor, token, baseUrl });
      setContent(finalContent);
      onChange({ target: { name, value: isEmptyContent(finalContent) ? null : finalContent } });
      return finalContent;
    };

    useImperativeHandle(ref, () => ({
      uploadLocalImages,
    }));

    return (
      <div>
        <style>
          {`
            .ql-snow .ql-editor pre.ql-syntax {
              background: #222 !important;
              color: #fff !important;
              border-radius: 5px;
              padding: 12px;
              font-family: 'Fira Mono', 'Consolas', 'Monaco', monospace;
              font-size: 0.95em;
            }
            .crop-overlay {
              z-index: 9999 !important;
            }
            .ql-toolbar[aria-disabled="true"] {
              pointer-events: none;
              opacity: 0.5;
            }
            /* Custom blockquote styling for Note */
            .ql-editor blockquote {
              border-left: 4px solid #3b82f6;
              margin-left: 0;
              margin-right: 0;
              padding-left: 1em;
              color: #374151;
              background: #f0f6ff;
              font-style: normal;
            }
            /* Custom Note button styling */
            .ql-toolbar .ql-note {
              font-weight: bold;
              border-left: 3px solid #3b82f6;
              padding-left: 6px;
              background: #e0e7ff;
              color: #2563eb;
              border-radius: 3px;
              margin-right: 4px;
            }
          `}
        </style>
        {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="bg-white"
          modules={modules}
          readOnly={disabled}
        />
        <script>
          {`
            const toolbar = document.querySelector('.ql-toolbar');
            if (toolbar) {
              toolbar.setAttribute('aria-disabled', '${disabled}');
            }
          `}
        </script>
      </div>
    );
  }
);

export default WysiwygInput;
