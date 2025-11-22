import { useEffect, useState, useCallback, useRef } from 'react';
import Icon from '../../../../../components/icons/icon';
import useProfileStore from '../../../../../zustand/profileStore';
import getCroppedImg from '../../../../../utils/cropImage';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../zustand/authStore';
import useConfirmationModalStore from '../../../../../zustand/confirmationModalStore';

export default function Profile() {
  const { profile, fetchProfile, updateProfile, loading } = useProfileStore();
  const setUser = useAuthStore((state) => state.setUser); // Tambahkan setter user
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    job: '',
    aboutMe: '',
  });

  // State for cropping
  const [cropState, setCropState] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawFile, setRawFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [cropType, setCropType] = useState('profile'); // 'profile' or 'cover'
  const coverFileInputRef = useRef(null);

  // Store cropped blobs for upload
  const [profileImageBlob, setProfileImageBlob] = useState(null);
  const [coverImageBlob, setCoverImageBlob] = useState(null);

  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const openConfirmationModal = useConfirmationModalStore((state) => state.openModal);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Prefill form when profile loaded
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.telephone || '',
        job: profile.detail?.expertise || '',
        aboutMe: profile.detail?.about || '',
      });
      setProfileImagePreview(profile.photo_profile || null);
      setCoverImagePreview(profile.detail?.photo_cover || null);
      setProfileImageBlob(null);
      setCoverImageBlob(null);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cover file input change, open crop modal
  const handleCoverFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      setLocalPreview(URL.createObjectURL(file));
      setCropState({ x: 0, y: 0 });
      setZoom(1);
      setCropType('cover');
      setShowCrop(true);
    }
  };

  // Trigger cover file input
  const handleEditCoverClick = () => {
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = null; // reset input
      coverFileInputRef.current.click();
    }
  };

  // Helper for cover and profile photo
  const coverUrl = coverImagePreview || profile?.detail?.photo_cover;
  const profileUrl =
    cropType === 'profile' && localPreview
      ? localPreview
      : profileImagePreview || profile?.photo_profile;

  // Handle file input change, open crop modal
  const handleProfileFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      setLocalPreview(URL.createObjectURL(file));
      setCropState({ x: 0, y: 0 });
      setZoom(1);
      setCropType('profile');
      setShowCrop(true);
    }
  };

  // Cropper callbacks
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Save cropped image
  const handleCropSave = async () => {
    let outputType = 'image/jpeg';
    if (rawFile && rawFile.type === 'image/png') {
      outputType = 'image/png';
    }
    const croppedImage = await getCroppedImg(localPreview, croppedAreaPixels, outputType);
    if (cropType === 'profile') {
      setProfileImagePreview(croppedImage.url);
      setProfileImageBlob(croppedImage.blob);
    } else if (cropType === 'cover') {
      setCoverImagePreview(croppedImage.url);
      setCoverImageBlob(croppedImage.blob);
    }
    setShowCrop(false);
    setRawFile(null);
    setLocalPreview(null);
    setCropType('profile');
    // Cropped image blob is stored for upload
  };

  // Cancel cropping
  const handleCropCancel = () => {
    setShowCrop(false);
    setRawFile(null);
    setLocalPreview(null);
    setCropType('profile');
  };

  // Tambahkan fungsi untuk update user di localStorage dan zustand
  const updateUserLocal = (updatedFields) => {
    // Ambil user lama dari localStorage
    const oldUser = JSON.parse(localStorage.getItem('userData')) || {};
    // Update field yang berubah
    const newUser = {
      ...oldUser,
      first_name: updatedFields.firstName,
      last_name: updatedFields.lastName,
      username: updatedFields.username,
      email: updatedFields.email,
      telephone: updatedFields.phone,
      detail: {
        ...oldUser.detail,
        expertise: updatedFields.job,
        about: updatedFields.aboutMe,
        ...(updatedFields.photo_profile && { photo_profile: updatedFields.photo_profile }),
        ...(updatedFields.photo_cover && { photo_cover: updatedFields.photo_cover }),
      },
      ...(updatedFields.photo_profile && { photo_profile: updatedFields.photo_profile }),
    };
    localStorage.setItem('userData', JSON.stringify(newUser));
    if (setUser) setUser(newUser);
  };

  const formDataRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Siapkan FormData
    const formData = new FormData();
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('telephone', form.phone);
    formData.append('expertise', form.job);
    formData.append('about', form.aboutMe);
    if (profileImageBlob) {
      formData.append('photo_profile', profileImageBlob, 'profile.jpg');
    }
    if (coverImageBlob) {
      formData.append('photo_cover', coverImageBlob, 'cover.jpg');
    }

    // Simpan formData di ref
    formDataRef.current = formData;

    openConfirmationModal({
      title: 'Konfirmasi Update Profil',
      message: 'Apakah Anda yakin ingin memperbarui profil Anda?',
      variant: 'warning',
      onConfirm: async () => {
        try {
          await updateProfile(formDataRef.current);
          toast.success('Profil berhasil diperbarui');
          updateUserLocal({
            ...form,
            photo_profile: profileImagePreview,
            photo_cover: coverImagePreview,
          });
          fetchProfile();
        } catch (err) {
          toast.error(err.message || 'Gagal memperbarui profil');
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <div>
      {/* Cover Image */}
      <div className="relative w-full">
        <div
          className={`
            w-full rounded-lg overflow-hidden
            aspect-[4/1]
            md:aspect-[3/1]
            sm:aspect-[2.5/1]
            xs:aspect-[2/1]
            min-h-[120px]
            ${!coverUrl ? 'bg-primary-700' : ''}
          `}
        >
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : null}
        </div>
        {/* Desktop & Tablet: Profile & Edit Cover on Cover */}
        <div
          className="absolute inset-0 flex flex-col w-full h-full p-4 sm:flex"
          style={{
            background: 'rgba(0,0,0,0.4)',
            color: 'white',
            borderRadius: '0.5rem',
          }}
        >
          <div className="w-full h-full flex items-end justify-between">
            <div className="flex items-end mb-4 ml-4 relative">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="Profile"
                  className="
                    w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg
                    md:w-40 md:h-40
                    sm:w-16 sm:h-16
                    max-w-full max-h-full
                  "
                />
              ) : (
                <div
                  className="
                    w-28 h-28 rounded-full border-4 border-white bg-gray-100 items-center justify-center shadow-lg
                    hidden sm:flex md:w-40 md:h-40
                    sm:w-16 sm:h-16
                    max-w-full max-h-full
                  "
                >
                  <Icon type="user" className="text-black w-4 h-4 md:w-16 md:h-16" />
                </div>
              )}
              {/* Ganti Foto Profil Button */}
              <label
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hidden sm:flex items-center justify-center
                  w-10 h-10
                  md:w-12 md:h-12
                  sm:w-7 sm:h-7
                  cursor-pointer
                "
                title="Ganti Foto Profil"
              >
                <Icon type="image" className="text-gray-700 text-base md:text-sm sm:text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  style={{ width: '100%', height: '100%' }}
                  onChange={handleProfileFileInput}
                  tabIndex={-1}
                />
              </label>
            </div>
            <button
              type="button"
              className="hidden sm:flex w-fit border-2 border-white text-white lg:text-lg py-2 px-8 rounded hover:bg-white hover:text-black mb-4 mr-4
              md:px-4 md:py-1 md:text-base
              sm:px-2 sm:py-1 sm:text-xs
            "
              onClick={handleEditCoverClick}
            >
              Edit Cover
            </button>
            <input
              type="file"
              accept="image/*"
              ref={coverFileInputRef}
              style={{ display: 'none' }}
              onChange={handleCoverFileInput}
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
      {/* Mobile: Profile & Edit Cover di bawah cover */}
      <div className="flex flex-col items-center gap-3 mt-[-2.5rem] sm:hidden">
        <div className="relative">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt="Profile"
              className="
                w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg
                max-w-full max-h-full
              "
            />
          ) : (
            <div
              className="
                w-20 h-20 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg
                max-w-full max-h-full
              "
            >
              <Icon type="user" className="text-gray-400 text-3xl" />
            </div>
          )}
          {/* Ganti Foto Profil Button (Mobile) */}
          <label
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md flex items-center justify-center
              w-7 h-7
              cursor-pointer
            "
            title="Ganti Foto Profil"
          >
            <Icon type="image" className="text-gray-700 text-xs" />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ width: '100%', height: '100%' }}
              onChange={handleProfileFileInput}
              tabIndex={-1}
            />
          </label>
        </div>
        <button
          type="button"
          className="w-fit border-2 border-black text-black text-xs py-1 px-4 rounded hover:bg-black hover:text-white"
          onClick={handleEditCoverClick}
        >
          Edit Cover
        </button>
        <input
          type="file"
          accept="image/*"
          ref={coverFileInputRef}
          style={{ display: 'none' }}
          onChange={handleCoverFileInput}
          tabIndex={-1}
        />
      </div>

      {/* Crop Modal */}
      {showCrop && localPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 crop-overlay">
          <div className="bg-white p-4 rounded shadow-lg relative w-[90vw] max-w-lg h-[60vw] max-h-[80vh] flex flex-col">
            <div className="relative flex-1">
              {/* Cropper */}
              <Cropper
                image={localPreview}
                crop={cropState}
                zoom={zoom}
                aspect={cropType === 'cover' ? 3 / 1 : 1}
                onCropChange={setCropState}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleCropCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary-500 text-white rounded"
                onClick={handleCropSave}
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="mt-6 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="firstName">Nama Depan</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="lastName">Nama Belakang</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <label htmlFor="phone">Telepon</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label htmlFor="job">Bidang Keahlian/pekerjaan</label>
            <input
              type="text"
              id="job"
              name="job"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.job}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="aboutMe">Tentang Saya</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            className="border border-gray-300 rounded p-2 w-full"
            value={form.aboutMe}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-primary-700 text-white py-2 px-8 rounded w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
