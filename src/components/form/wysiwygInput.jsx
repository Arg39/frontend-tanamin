import { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Custom toolbar options including color and background
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }], // color pickers
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function WysiwygInput({ label, name, value, onChange, placeholder }) {
  const quillRef = useRef(null);

  const handleChange = (content) => {
    onChange({
      target: {
        name,
        value: content,
      },
    });
  };

  // Auto-resize logic
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.().root;
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
  }, [value]);

  return (
    <div>
      {label && <label className="block mb-2">{label}</label>}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white-100"
        modules={modules}
      />
    </div>
  );
}
