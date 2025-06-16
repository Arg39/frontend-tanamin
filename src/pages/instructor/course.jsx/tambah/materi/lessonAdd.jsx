import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../template/templateInstructor';
import Icon from '../../../../../components/icons/icon';
import TextInput from '../../../../../components/form/textInput';
import SelectOption from '../../../../../components/form/selectOption';
import WysiwygInput from '../../../../../components/form/wysiwygInput'; // Import WysiwygInput

export default function LessonAdd() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(''); // State untuk konten WYSIWYG

  // Example options for the SelectOption component
  const learningTypes = [
    { value: 'material', label: 'Material' },
    { value: 'quiz', label: 'Quiz' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Judul Materi:', e.target.title.value);
    console.log('Konten Materi:', content);
    // Tambahkan logika untuk menyimpan data
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white-100 p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <div>
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white-100 px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon type="arrow-left" className="size-[1rem] text-white-100" />
            <span className="text-white-100">Kembali</span>
          </button>
          <h4 className="text-primary-700 text-lg sm:text-2xl font-bold">Tambah materi kursus</h4>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput label="Judul materi" name="title" placeholder="Masukkan judul materi" />
          <SelectOption
            label="Jenis Pembelajaran"
            name="jenisPembelajaran"
            options={learningTypes}
            value={'material'}
            disabled
          />
          <WysiwygInput
            label="Konten Materi"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis konten materi di sini..."
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-fit bg-primary-700 text-white-100 px-4 py-2 rounded-md hover:bg-primary-600"
            >
              Simpan Materi
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
