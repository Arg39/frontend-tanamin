import React, { useState, useEffect } from 'react';
import AdminTemplate from '../../../../../../template/templateAdmin';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../../../../components/icons/icon';
import TextInput from '../../../../../../components/form/textInput';
import useCompanyStore from '../../../../../../zustand/companyProfileStore';
import useConfirmationModalStore from '../../../../../../zustand/confirmationModalStore';
import { toast } from 'react-toastify';

export default function AdminProfilPerusahaanEdit() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Tentang Perusahaan', path: '/admin/tentang-perusahaan' },
    { label: 'Edit Tentang Perusahaan', path: location.pathname },
  ];
  const navigate = useNavigate();

  const { openModal, closeModal } = useConfirmationModalStore();

  // Zustand store
  const { companyProfile, fetchCompanyProfile, loading, saveCompanyProfile } = useCompanyStore();

  // Local states
  const [about, setAbout] = useState('');
  const [vision, setVision] = useState('');
  const [missions, setMissions] = useState(['']);
  const [statistics, setStatistics] = useState([{ title: '', value: '', unit: '' }]);

  // Fetch and sync data from store
  useEffect(() => {
    fetchCompanyProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (companyProfile) {
      setAbout(companyProfile.about || '');
      setVision(companyProfile.vision || ''); // Ambil vision sebagai string
      setMissions(
        Array.isArray(companyProfile.mission)
          ? companyProfile.mission.length > 0
            ? companyProfile.mission
            : ['']
          : companyProfile.mission
          ? [companyProfile.mission]
          : ['']
      );
      setStatistics(
        Array.isArray(companyProfile.statistics) && companyProfile.statistics.length > 0
          ? companyProfile.statistics
          : [{ title: '', value: '', unit: '' }]
      );
    }
  }, [companyProfile]);
  const handleVisionChange = (e) => {
    setVision(e.target.value);
  };

  const handleMissionChange = (idx, e) => {
    const newMissions = [...missions];
    newMissions[idx] = e.target.value;
    setMissions(newMissions);
  };
  const addMission = () => setMissions([...missions, '']);
  const removeMission = (idx) => setMissions(missions.filter((_, i) => i !== idx));

  const handleStatisticChange = (idx, field, e) => {
    const newStats = [...statistics];
    newStats[idx][field] = e.target.value;
    setStatistics(newStats);
  };
  const addStatistic = () => setStatistics([...statistics, { title: '', value: '', unit: '' }]);
  const removeStatistic = (idx) => setStatistics(statistics.filter((_, i) => i !== idx));

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    openModal({
      title: 'Konfirmasi Simpan',
      message: 'Apakah Anda yakin ingin menyimpan profil perusahaan dengan data ini?',
      variant: 'primary',
      onConfirm: async () => {
        closeModal();
        try {
          await saveCompanyProfile({
            about,
            vision,
            mission: missions,
            statistics,
          });
          toast.success('Profil perusahaan berhasil disimpan');
        } catch (error) {
          toast.error('Error saving company profile:', error);
        }
        navigate(-1);
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <AdminTemplate activeNav={'tentang perusahaan'} breadcrumbItems={breadcrumbItems}>
      <form onSubmit={handleSubmit}>
        <div className="w-full bg-white rounded-md flex flex-col p-3 sm:p-6 shadow-md">
          <button
            type="button"
            className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
            onClick={() => navigate(-1)}
          >
            <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
            <span>Kembali</span>
          </button>
          <h2 className="text-lg sm:text-2xl font-bold text-primary-700 mb-0">
            Edit Profil Perusahaan
          </h2>

          {/* Tentang Perusahaan */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-6">
            <TextInput
              label="Tentang Perusahaan"
              name="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tentang perusahaan"
              textarea
              rows={3}
            />
          </div>

          {/* Visi */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-6">
            <div className="w-full flex flex-col gap-3 mt-3">
              <TextInput
                label={'Visi'}
                name="vision"
                value={vision}
                onChange={handleVisionChange}
                placeholder="Visi"
                className="block w-full"
              />
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="mb-2 text-sm font-medium text-gray-700">Misi</span>
              <button
                type="button"
                className="flex items-center p-2 px-4 gap-1 text-white bg-primary-700 hover:bg-primary-900 font-medium rounded-md"
                onClick={addMission}
              >
                <Icon type="plus" className="w-6 h-6" />
                Misi
              </button>
            </div>
            <div className="w-full flex flex-col gap-3">
              {missions.map((mission, idx) => (
                <div key={idx} className="w-full flex gap-3">
                  <div className="flex-grow">
                    <TextInput
                      name={`mission-${idx}`}
                      value={mission}
                      onChange={(e) => handleMissionChange(idx, e)}
                      placeholder={`Misi ${idx + 1}`}
                      className="block w-full"
                    />
                  </div>
                  {missions.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 mt-1"
                      onClick={() => removeMission(idx)}
                      aria-label="Hapus misi"
                    >
                      <Icon type="trash" className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Statistik */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow border">
            <div className="flex items-center justify-between mb-3">
              <span className="mb-2 text-sm font-medium text-gray-700">Statistik Perusahaan</span>
              <button
                type="button"
                className="flex items-center p-2 px-4 gap-1 text-white bg-primary-700 hover:bg-primary-900 font-medium rounded-md"
                onClick={addStatistic}
              >
                <Icon type="plus" className="w-6 h-6" />
                Statistik
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {statistics.map((stat, idx) => (
                <div key={idx} className="bg-primary-50 rounded-lg p-4 shadow-inner">
                  <div className="w-full flex gap-3 items-start sm:items-center">
                    {/* Input 3 kolom */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <TextInput
                        name={`stat-title-${idx}`}
                        value={stat.title}
                        onChange={(e) => handleStatisticChange(idx, 'title', e)}
                        placeholder="Judul"
                        className="w-full"
                      />
                      <TextInput
                        name={`stat-value-${idx}`}
                        value={stat.value}
                        onChange={(e) => handleStatisticChange(idx, 'value', e)}
                        placeholder="Nilai"
                        type="number"
                        className="w-full"
                      />
                      <TextInput
                        name={`stat-unit-${idx}`}
                        value={stat.unit}
                        onChange={(e) => handleStatisticChange(idx, 'unit', e)}
                        placeholder="Satuan"
                        className="w-full"
                      />
                    </div>

                    {/* Tombol hapus */}
                    {statistics.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                        onClick={() => removeStatistic(idx)}
                        aria-label="Hapus statistik"
                      >
                        <Icon type="trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary-700 hover:bg-primary-900 text-white font-semibold rounded-md shadow"
              disabled={loading}
            >
              <Icon type="save" className="w-5 h-5" />
              Simpan
            </button>
          </div>
        </div>
      </form>
    </AdminTemplate>
  );
}
