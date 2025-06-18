import { create } from 'zustand';

const useWysiwygStore = create(() => ({
  uploadLocalImages: async ({ editor, token, baseUrl }) => {
    if (!editor) return editor?.root?.innerHTML || '';

    const imgs = editor.root.querySelectorAll('img');

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

    // Normalisasi src setelah upload
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

    return editor.root.innerHTML;
  },
}));

export default useWysiwygStore;
