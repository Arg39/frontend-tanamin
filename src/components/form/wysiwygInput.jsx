import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useWysiwygStore from '../../zustand/wysiwyg/wysiwygStore';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    [{ align: [] }, 'bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'code-block'],
  ],
};

const WysiwygInput = forwardRef(({ label, name, value, onChange, placeholder }, ref) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState(value || '');
  const uploadLocalImagesStore = useWysiwygStore((state) => state.uploadLocalImages);

  useEffect(() => {
    if (value !== content) {
      setContent(value || '');
    }
  }, [value]);

  const handleChange = (content) => {
    setContent(content);
    onChange({
      target: { name, value: content },
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
    }
  }, [content]);

  const uploadLocalImages = async (token) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return content;

    const baseUrlRaw = process.env.REACT_APP_BACKEND_BASE_URL || '';
    const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw;

    const finalContent = await uploadLocalImagesStore({ editor, token, baseUrl });
    setContent(finalContent);
    onChange({ target: { name, value: finalContent } });

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
            z-index: 9999 !important; /* Ensure crop overlay is on top */
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
        className="bg-white-100"
        modules={modules}
      />
    </div>
  );
});

export default WysiwygInput;
