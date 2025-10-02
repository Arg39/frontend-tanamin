import { useEffect, useState } from 'react';
import InstructorTemplate from '../../../../../template/templateInstructor';
import Icon from '../../../../../components/icons/icon';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../../../../components/form/textInput';
import useCourseAttributeStore from '../../../../../zustand/courseAttributeStore';
import { toast } from 'react-toastify';

export default function CourseAttributeAdd() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { addAttributesBulk, attributeLoading, attributeError, attribute, fetchAttribute } =
    useCourseAttributeStore();

  // State for attributes, benefits, and prerequisites
  const [description, setDescription] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [prerequisites, setPrerequisites] = useState(['']);
  const [loading, setLoading] = useState(false);

  // Fetch attribute data on mount
  useEffect(() => {
    if (courseId) {
      fetchAttribute({ id: courseId });
    }
    // eslint-disable-next-line
  }, [courseId]);

  // Sync store data to local state
  useEffect(() => {
    if (attribute) {
      setDescription(
        attribute.description && attribute.description[0]?.content?.length > 0
          ? attribute.description[0].content
          : ['']
      );
      setBenefits(
        attribute.benefit && attribute.benefit[0]?.content?.length > 0
          ? attribute.benefit[0].content
          : ['']
      );
      setPrerequisites(
        attribute.prerequisite && attribute.prerequisite[0]?.content?.length > 0
          ? attribute.prerequisite[0].content
          : ['']
      );
    }
  }, [attribute]);

  // Handlers for attributes
  const handleAttributeChange = (idx, e) => {
    const newAttrs = [...description];
    newAttrs[idx] = e.target.value;
    setDescription(newAttrs);
  };
  const addAttributeField = () => setDescription([...description, '']);
  const removeAttributeField = (idx) => setDescription(description.filter((_, i) => i !== idx));

  // Handlers for benefits
  const handleBenefitChange = (idx, e) => {
    const newBenefits = [...benefits];
    newBenefits[idx] = e.target.value;
    setBenefits(newBenefits);
  };
  const addBenefitField = () => setBenefits([...benefits, '']);
  const removeBenefitField = (idx) => setBenefits(benefits.filter((_, i) => i !== idx));

  // Handlers for prerequisites
  const handlePrerequisiteChange = (idx, e) => {
    const newPre = [...prerequisites];
    newPre[idx] = e.target.value;
    setPrerequisites(newPre);
  };
  const addPrerequisiteField = () => setPrerequisites([...prerequisites, '']);
  const removePrerequisiteField = (idx) =>
    setPrerequisites(prerequisites.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepare payloads as array of string (tanpa type)
      const descriptionPayloads = description.filter((a) => a.trim() !== '');
      const benefitPayloads = benefits.filter((b) => b.trim() !== '');
      const prerequisitePayloads = prerequisites.filter((p) => p.trim() !== '');

      // Kirim field sesuai backend: description, benefits, prerequisites
      const result = await addAttributesBulk({
        id: courseId,
        descriptions: descriptionPayloads,
        benefits: benefitPayloads,
        prerequisites: prerequisitePayloads,
      });

      if (result.status === 'success') {
        toast.success('Berhasil menambahkan atribut');
        navigate(-1);
      } else {
        toast.error(result?.message || 'Gagal menambahkan atribut');
      }
    } catch (e) {
      toast.error(e.message || 'Terjadi kesalahan');
    }
    setLoading(false);
  };

  return (
    <InstructorTemplate activeNav="kursus">
      <div className="w-full bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col">
        <button
          className="flex w-fit items-center gap-2 bg-secondary-900 text-white px-3 py-2 sm:px-4 rounded-md mb-2 hover:bg-secondary-800 text-sm sm:text-base"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="size-[1rem] text-white" />
          Kembali
        </button>
        <div className="text-2xl font-bold mb-2">Tambah/Edit Atribut & Persyaratan Kursus</div>
        {attributeLoading ? (
          <div>Loading...</div>
        ) : attributeError ? (
          <div className="text-red-500">{attributeError}</div>
        ) : (
          <>
            {/* Container for Prerequisites */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="mb-2 text-sm font-medium text-gray-700">Persyaratan Kursus</span>
                <button
                  type="button"
                  className="flex items-center p-1 px-2 gap-1 text-white bg-primary-700 hover:bg-primary-900 font-medium rounded-md"
                  onClick={addPrerequisiteField}
                >
                  <Icon type="plus" className="w-5 h-5" />
                  Persyaratan
                </button>
              </div>
              <div className="w-full flex flex-col gap-3">
                {prerequisites.map((pre, idx) => (
                  <div key={idx} className="w-full flex gap-3">
                    <div className="flex-grow">
                      <TextInput
                        name={`prerequisite-${idx}`}
                        value={pre}
                        onChange={(e) => handlePrerequisiteChange(idx, e)}
                        placeholder={`Persyaratan ${idx + 1}`}
                        className="block w-full"
                      />
                    </div>
                    {prerequisites.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 mt-1"
                        onClick={() => removePrerequisiteField(idx)}
                        aria-label="Hapus persyaratan"
                      >
                        <Icon type="trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Container for Attributes */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="mb-2 text-sm font-medium text-gray-700">Deskripsi Kursus</span>
                <button
                  type="button"
                  className="flex items-center p-1 px-2 gap-1 text-white bg-primary-700 hover:bg-primary-900 font-medium rounded-md"
                  onClick={addAttributeField}
                >
                  <Icon type="plus" className="w-5 h-5" />
                  Atribut
                </button>
              </div>
              <div className="w-full flex flex-col gap-3">
                {description.map((attr, idx) => (
                  <div key={idx} className="w-full flex gap-3">
                    <div className="flex-grow">
                      <TextInput
                        name={`attribute-${idx}`}
                        value={attr}
                        onChange={(e) => handleAttributeChange(idx, e)}
                        placeholder={`Atribut ${idx + 1}`}
                        className="block w-full"
                      />
                    </div>
                    {description.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 mt-1"
                        onClick={() => removeAttributeField(idx)}
                        aria-label="Hapus atribut"
                      >
                        <Icon type="trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Container for Benefits */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow border mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="mb-2 text-sm font-medium text-gray-700">Benefit Kursus</span>
                <button
                  type="button"
                  className="flex items-center p-1 px-2 gap-1 text-white bg-primary-700 hover:bg-primary-900 font-medium rounded-md"
                  onClick={addBenefitField}
                >
                  <Icon type="plus" className="w-5 h-5" />
                  Benefit
                </button>
              </div>
              <div className="w-full flex flex-col gap-3">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="w-full flex gap-3">
                    <div className="flex-grow">
                      <TextInput
                        name={`benefit-${idx}`}
                        value={benefit}
                        onChange={(e) => handleBenefitChange(idx, e)}
                        placeholder={`Benefit ${idx + 1}`}
                        className="block w-full"
                      />
                    </div>
                    {benefits.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 mt-1"
                        onClick={() => removeBenefitField(idx)}
                        aria-label="Hapus benefit"
                      >
                        <Icon type="trash" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-primary-700 text-white px-6 py-2 rounded-lg shadow hover:bg-primary-800 transition font-medium text-base flex items-center"
                disabled={loading}
              >
                <Icon type="save" className="w-5 h-5 mr-2" />
                Simpan
              </button>
            </div>
          </>
        )}
      </div>
    </InstructorTemplate>
  );
}
