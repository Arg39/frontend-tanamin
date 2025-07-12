import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminTemplate from '../../../template/templateAdmin';
import ProfilePreview from '../../instructor/profile/profilePreview';
import useProfileStore from '../../../zustand/profileStore';

export default function InstructorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile, userProfileLoading, userProfileError, fetchUserProfileById } =
    useProfileStore();

  useEffect(() => {
    if (id) fetchUserProfileById(id);
    // eslint-disable-next-line
  }, [id]);

  return (
    <AdminTemplate activeNav={'instruktur'}>
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
