import React from 'react';
import AdminTemplate from '../../../template/templateAdmin';
import TextInput from '../../../components/form/textInput';
import ImagePicker from '../../../components/form/imagePicker';
import Button from '../../../components/button/button';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/icons/icon';

export default function InstructorAdd() {
  const navigate = useNavigate();
  return (
    <AdminTemplate activeNav="instruktur">
      <div className="wf-full bg-white-100 p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 bg-secondary-900 text-white-100 px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-4" color="currentColor" />
          <span>Kembali</span>
        </button>
        <h2 className="text-2xl font-bold">Tambah Instruktur</h2>
        <form className="w-full mt-4 space-y-4">
          <TextInput label="Nama Kategori" name="name" placeholder="Masukkan nama kategori" />
          <ImagePicker label="Gambar Kategori" name="image" />
          <div className="w-full flex justify-end">
            <Button type="submit" variant="form">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AdminTemplate>
  );
}
