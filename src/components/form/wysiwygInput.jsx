import { useRef, useEffect, useState } from 'react';
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

export default function WysiwygInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  onLocalImagesChange,
}) {
  const quillRef = useRef(null);
  const [localImages, setLocalImages] = useState([]);

  const handleChange = (content) => {
    const editor = quillRef.current?.getEditor?.();
    const images = Array.from(editor?.root?.querySelectorAll('img') || []);
    const localImages = images.map((img) => img.src).filter((src) => !src.startsWith('http')); // Filter out images from URLs

    setLocalImages(localImages);
    onLocalImagesChange(localImages); // Notify parent component about local images

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
