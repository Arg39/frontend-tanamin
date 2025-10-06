import React, { useState } from 'react';
import ProfileSidebar from '../profileSidebar';
import Profile from './content/profile';
import Password from './content/password';
import SocialMedia from './content/socialMedia';

export default function Setting() {
  const [activeTab, setActiveTab] = useState('profil');

  const tabOptions = [
    { key: 'profil', label: 'Profil' },
    { key: 'password', label: 'Password' },
    { key: 'sosial-media', label: 'Sosial Media' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return <Profile />;
      case 'password':
        return <Password />;
      case 'sosial-media':
        return <SocialMedia />;
      default:
        return null;
    }
  };

  return (
    <ProfileSidebar activeNav={'pengaturan'}>
      <div className="min-h-[660px] bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold border-b-2 pb-4 mb-6">Profil Saya</h1>
        {/* Mobile: Dropdown */}
        <div className="md:hidden mb-4">
          <select
            className="w-full border border-gray-200 rounded px-4 py-2 text-base"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabOptions.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop: Tabs */}
        <div className="hidden md:flex flex-row border-b-2 border-gray-100 mb-4">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              className={`w-full md:w-auto pb-2 md:pb-2 px-4 md:px-8 border-b-2 font-semibold text-base md:text-lg transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500'
                  : 'border-transparent hover:border-primary-200'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </ProfileSidebar>
  );
}
