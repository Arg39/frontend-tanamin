import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InstructorTemplate from '../../../../../template/templateInstructor';
import TextInput from '../../../../../components/form/textInput';
import Icon from '../../../../../components/icons/icon';
import useModuleStore from '../../../../../zustand/material/moduleStore';

export default function ModulEdit() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
  });

  const { getModuleById, updateModule, loading, error } = useModuleStore();

  useEffect(() => {
    async function fetchModule() {
      try {
        const module = await getModuleById(moduleId, courseId);
        if (module) {
          setFormData({ title: module.title || '' });
        }
      } catch (e) {
        // Error handled by store
      }
    }
    fetchModule();
    // eslint-disable-next-line
  }, [moduleId, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      // Prevent submit if title is empty
      return;
    }
    try {
      await updateModule({ moduleId, courseId, title: formData.title.trim() });
      navigate(-1);
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4">
        <div>
          <button
            className="flex items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon type="arrow-left" className="size-[1rem] text-white" />
            <span className="text-white">Kembali</span>
          </button>
          <h4 className="text-primary-700 text-lg sm:text-2xl font-bold">Edit modul kursus</h4>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Judul Modul"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul modul"
            disabled={loading}
            required // <-- add required attribute
          />
          {!formData.title.trim() && (
            <div className="text-red-500 text-sm">Judul modul wajib diisi.</div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-fit bg-primary-700 text-white px-4 py-2 rounded-md hover:bg-primary-600"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? 'Menyimpan...' : 'Update Modul'}
            </button>
          </div>
        </form>
      </div>
    </InstructorTemplate>
  );
}
