import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InstructorTemplate from '../../../template/templateInstructor';
import Icon from '../../../components/icons/icon';

// Dummy data
const dummyProfile = {
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  first_name: 'Banu',
  last_name: 'Pratama',
  username: 'banupra',
  email: 'banu.pratama@email.com',
  telephone: '+628123456789',
  expertise: 'Web Development, React, Node.js',
  about: 'Instruktur berpengalaman di bidang pengembangan web dan teknologi modern.',
  social_media: [
    { type: 'instagram', url: 'https://instagram.com/banupra' },
    { type: 'linkedin', url: 'https://linkedin.com/in/banupra' },
    { type: 'twitter-x', url: 'https://twitter.com/banupra' },
  ],
};

export default function InstructorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(dummyProfile);
  }, []);

  const breadcrumbItems = [{ label: 'Profile', path: location.pathname }];

  return (
    <InstructorTemplate breadcrumbItems={breadcrumbItems}>
      <div className="w-full bg-white rounded-md flex flex-col p-6 shadow-md">
        {/* Back Button */}
        <button
          className="w-fit flex items-center gap-2 bg-secondary-900 text-white px-4 py-2 rounded-md mb-4 hover:bg-secondary-800"
          onClick={() => navigate(-1)}
        >
          <Icon type="arrow-left" className="w-4 h-4" color="currentColor" />
          <span>Kembali</span>
        </button>

        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <h2 className="text-2xl font-bold text-primary-700">Profile Instruktur</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-700 transition-colors">
            <Icon type="edit" />
            Edit Profile
          </button>
        </div>

        {/* Content */}
        {profile && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo & Social */}
            <div className="flex-shrink-0 w-full md:w-64 flex flex-col items-center bg-white rounded-lg p-6 shadow border border-gray-100 mx-auto">
              <img
                src={profile.photo}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 mb-4 shadow"
              />
              <div className="text-xl text-primary-700 font-semibold break-all text-center">
                @{profile.username}
              </div>
              <div className="flex gap-3 mt-3 flex-wrap justify-center">
                {profile.social_media.map((sm, idx) => (
                  <a
                    key={idx}
                    href={sm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition"
                  >
                    <Icon type={sm.type} className="w-7 h-7" />
                  </a>
                ))}
              </div>
            </div>

            {/* Detail Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow border space-y-4">
                {[
                  ['First Name', profile.first_name],
                  ['Last Name', profile.last_name],
                  ['Email', profile.email],
                  ['Telepon', profile.telephone],
                  ['Keahlian', profile.expertise],
                ].map(([label, value], idx) => (
                  <div key={idx} className="min-w-0">
                    <span className="block text-tertiary-500 text-xs font-semibold mb-1">
                      {label}
                    </span>
                    <div className="text-base text-primary-700 font-semibold break-all whitespace-pre-wrap">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-6 shadow border flex flex-col">
                <span className="block text-tertiary-500 text-xs font-semibold mb-1">
                  Tentang Instruktur
                </span>
                <div className="text-base text-primary-700 font-semibold whitespace-pre-wrap break-words">
                  {profile.about}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorTemplate>
  );
}
