import { useState, useEffect } from 'react';
import useProfileStore from '../../../../../zustand/profileStore';
import { toast } from 'react-toastify';

export default function SocialMedia() {
  const [form, setForm] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: '',
  });

  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const profile = useProfileStore((state) => state.profile);

  const updateProfile = useProfileStore((state) => state.updateProfile);

  // Fetch profile on mount and set initial social media values
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profile && profile.detail && Array.isArray(profile.detail.social_media)) {
      const socialMediaObj = {
        instagram: '',
        twitter: '',
        facebook: '',
        linkedin: '',
      };
      profile.detail.social_media.forEach((item) => {
        if (item.platform in socialMediaObj) {
          socialMediaObj[item.platform] = item.url;
        }
      });
      setForm(socialMediaObj);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build social_media array with non-empty values
    const socialMediaArr = Object.entries(form)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([platform, url]) => ({
        platform,
        url,
      }));

    const formData = new FormData();
    formData.append('social_media', JSON.stringify(socialMediaArr));

    try {
      await updateProfile(formData);
      toast.success('Social media updated successfully');
      // Optionally refetch profile to update UI
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update social media');
    }
  };

  return (
    <div>
      <form className="mt-6 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <label htmlFor="instagram">Instagram</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.twitter}
              onChange={handleChange}
              placeholder="Twitter URL"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="facebook">Facebook</label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.facebook}
              onChange={handleChange}
              placeholder="Facebook URL"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              className="border border-gray-300 rounded p-2 w-full"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn URL"
              autoComplete="off"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary-700 text-white py-2 px-8 rounded w-full sm:w-auto"
        >
          Update Social Media
        </button>
      </form>
    </div>
  );
}
