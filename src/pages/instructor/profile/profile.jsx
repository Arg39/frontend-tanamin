import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InstructorTemplate from '../../../template/templateInstructor';
import useProfileStore from '../../../zustand/profileStore';
import ProfilePreview from './profilePreview';

export default function InstructorProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const breadcrumbItems = [{ label: 'Profile', path: location.pathname }];

  return (
    <InstructorTemplate breadcrumbItems={breadcrumbItems}>
      <ProfilePreview
        profile={profile}
        loading={loading}
        error={error}
        onBack={() => navigate(-1)}
        onEdit={() => navigate('/instruktur/profile/edit')}
        showEdit={true}
        showBack={true}
      />
    </InstructorTemplate>
  );
}
