import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminTemplate from '../../../../template/templateAdmin';
import ProfilePreview from '../../../instructor/profile/profilePreview';
import useProfileStore from '../../../../zustand/profileStore';

export default function InstructorDetail() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Instruktur', path: '/admin/instruktur' },
    { label: 'Detail Instruktur', path: location.pathname },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, userProfileLoading, userProfileError, fetchUserProfileById } =
    useProfileStore();

  useEffect(() => {
    if (id) fetchUserProfileById(id);
  }, [id]);

  return (
    <AdminTemplate activeNav={'instruktur'} breadcrumbItems={breadcrumbItems}>
      <ProfilePreview
        profile={userProfile}
        loading={userProfileLoading}
        error={userProfileError}
        showEdit={false}
        onBack={() => navigate(-1)}
      />
    </AdminTemplate>
  );
}
