import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../template/templateAdmin';
import Icon from '../../../components/icons/icon';
import TextInput from '../../../components/form/textInput';
import FileInput from '../../../components/form/fileInput';

export default function CategoryAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add logic to handle form submission (e.g., API call)
  };

  return (
    <AdminTemplate activeNav="kategori">
      <div className="wf-full bg-white-100 p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white-100 px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <TextInput
            label="Nama Kategori"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama kategori"
          />
          <FileInput label="Gambar Kategori" name="image" onChange={handleFileChange} />
          <button
            type="submit"
            className="bg-primary-900 text-white-100 px-4 py-2 rounded-md hover:bg-primary-800"
          >
            Simpan
          </button>
        </form>
      </div>
    </AdminTemplate>
  );
}
