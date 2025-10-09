import React from 'react';
import StarRating from '../content/star/star';
import Icon from '../icons/icon';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  // Format: dd/mm/yy
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export default function ReviewCard({ user, rating, comment, created_at }) {
  const hasPhoto = !!user?.photo_profile;
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-primary-700">
      {hasPhoto ? (
        <img
          className="w-16 h-16 sm:w-32 sm:h-32 rounded-md object-cover mb-2 sm:mb-0"
          src={user.photo_profile}
          alt={user?.full_name || user?.name || 'User'}
        />
      ) : (
        <div className="w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-400 rounded-md mb-2 sm:mb-0">
          <Icon type="user" className="w-10 h-10 sm:w-20 sm:h-20 text-gray-600" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-primary-700 font-semibold text-base sm:text-lg">
          {user?.full_name || user?.name || user?.email || 'User'}
        </p>
        <div className="flex flex-row gap-2 items-center mb-1">
          <StarRating value={rating} size={5} />
          <p className="text-xs sm:text-sm text-gray-500">{formatDate(created_at)}</p>
        </div>
        <p className="text-sm sm:text-base">{comment}</p>
      </div>
    </div>
  );
}
