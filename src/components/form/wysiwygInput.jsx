import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const WysiwygInput = forwardRef(({ label, name, value, onChange, placeholder }, ref) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState(value || '');

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

    const imgs = editor.root.querySelectorAll('img');

    const baseUrlRaw = process.env.REACT_APP_BACKEND_BASE_URL || '';
    const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw;

    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (!src) continue;

      if (!src.startsWith('http')) {
        if (src.startsWith('/')) {
          img.setAttribute('src', baseUrl + src);
        } else {
          try {
            const blob = await (await fetch(src)).blob();
            const formData = new FormData();
            formData.append('image', blob, `image_${Date.now()}.png`);

            const res = await fetch(`${baseUrl}/api/image`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
              body: formData,
            });

            if (!res.ok) throw new Error('Upload gambar gagal');

            const data = await res.json();

            console.log('Gambar berhasil diupload:', data.url);
            let finalUrl = data.url;
            if (finalUrl && !finalUrl.startsWith('http')) {
              if (finalUrl.startsWith('/')) {
                finalUrl = baseUrl + finalUrl;
              } else {
                finalUrl = baseUrl + '/' + finalUrl;
              }
            }
            img.setAttribute('src', finalUrl);
          } catch (e) {
            console.error('Gagal upload gambar lokal:', e);
          }
        }
      }
    }

    const imgsAfter = editor.root.querySelectorAll('img');
    imgsAfter.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http')) {
        if (src.startsWith('/')) {
          img.setAttribute('src', baseUrl + src);
        } else {
          img.setAttribute('src', baseUrl + '/' + src);
        }
      }
    });

    const finalContent = editor.root.innerHTML;
    setContent(finalContent);
    onChange({ target: { name, value: finalContent } });

    return finalContent;
  };

  useImperativeHandle(ref, () => ({
    uploadLocalImages,
  }));

  return (
    <div>
      {label && <label className="block mb-2">{label}</label>}
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
