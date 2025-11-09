import React, { useEffect } from 'react';
import AdminTemplate from '../../../../template/templateAdmin';
import ProfilePreview from '../../../instructor/profile/profilePreview';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useProfileStore from '../../../../zustand/profileStore';

export default function StudentDetail() {
  const location = useLocation();
  const breadcrumbItems = [
    { label: 'Peserta', path: '/admin/peserta' },
    { label: 'Detail Peserta', path: location.pathname },
  ];
  const { id } = useParams();
  const navigate = useNavigate();

  const { userProfile, userProfileLoading, userProfileError, fetchUserProfileById } =
    useProfileStore();

  useEffect(() => {
    if (id) fetchUserProfileById(id);
  }, [id]);

  return (
    <AdminTemplate activeNav={'peserta'} breadcrumbItems={breadcrumbItems}>
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
