import { useState } from 'react';
import Icon from '../../../../../components/icons/icon';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../zustand/profileStore';

export default function Password() {
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Ambil updatePassword dari store
  const updatePassword = useProfileStore((state) => state.updatePassword);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setForm({
      newPassword: '',
      confirmPassword: '',
    });
    setShowPassword({
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Password tidak sama');
      return;
    }
    try {
      await updatePassword(form.newPassword);
      toast.success('Password berhasil diubah');
      setEditing(false);
      setForm({
        newPassword: '',
        confirmPassword: '',
      });
      setShowPassword({
        newPassword: false,
        confirmPassword: false,
      });
    } catch (err) {
      // Error toast sudah dihandle di store
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div>
      <form className="mt-6 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-4">
          <div className="w-full relative">
            <label htmlFor="newPassword">Password Baru</label>
            <input
              type={editing && showPassword.newPassword ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              className="border border-gray-300 rounded p-2 w-full pr-10"
              value={editing ? form.newPassword : ''}
              onChange={handleChange}
              disabled={!editing}
              autoComplete="new-password"
              style={{ paddingRight: editing ? '2.5rem' : undefined }}
            />
            {editing && (
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-11 -translate-y-1/2 text-gray-500 flex items-center justify-center h-6 w-6"
                onClick={() => toggleShowPassword('newPassword')}
                style={{ padding: 0 }}
                aria-label={
                  showPassword.newPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
              >
                <Icon type={showPassword.newPassword ? 'eye' : 'eye-off'} className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="w-full relative">
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input
              type={editing && showPassword.confirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className="border border-gray-300 rounded p-2 w-full pr-10"
              value={editing ? form.confirmPassword : ''}
              onChange={handleChange}
              disabled={!editing}
              autoComplete="new-password"
              style={{ paddingRight: editing ? '2.5rem' : undefined }}
            />
            {editing && (
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-11 -translate-y-1/2 text-gray-500 flex items-center justify-center h-6 w-6"
                onClick={() => toggleShowPassword('confirmPassword')}
                style={{ padding: 0 }}
              >
                <Icon type={showPassword.confirmPassword ? 'eye' : 'eye-off'} className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {!editing ? (
            <button
              type="button"
              className="bg-primary-700 text-white py-2 px-8 rounded w-full sm:w-auto"
              onClick={handleEdit}
            >
              Edit Password
            </button>
          ) : (
            <>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleCancel}
              >
                Batal
              </button>
              <button type="submit" className="bg-primary-700 text-white py-2 px-8 rounded">
                Update Password
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
