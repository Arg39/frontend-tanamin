import React, { useEffect } from 'react';
import ProfileSidebar from '../profileSidebar';
import Card from '../../../../components/card/card';
import useBookmarkStore from '../../../../zustand/public/bookmarkStore';
import useAuthStore from '../../../../zustand/authStore';

export default function Bookmark() {
  const token = useAuthStore((state) => state.token);
  const { bookmarks, loading, error, fetchBookmarks, removeBookmark, bookmarkLoading } =
    useBookmarkStore();

  useEffect(() => {
    if (token) fetchBookmarks(token);
  }, [token, fetchBookmarks]);

  const handleToggleBookmark = (courseId) => {
    removeBookmark(courseId);
  };

  return (
    <ProfileSidebar activeNav={'bookmark'}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold border-b-2 pb-4 mb-6">Bookmark Saya</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Gagal memuat bookmark.</div>}
        {!loading && !error && bookmarks.length === 0 && (
          <div className="text-gray-500">Belum ada kursus yang di-bookmark.</div>
        )}
        {!loading && !error && bookmarks.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bookmarks.map((course) => (
              <Card
                key={course.id}
                course={course}
                showBookmark={true}
                bookmark={true}
                content={true}
                onToggleBookmark={handleToggleBookmark}
                bookmarkLoading={!!bookmarkLoading?.[course.id]}
              />
            ))}
          </div>
        )}
      </div>
    </ProfileSidebar>
  );
}
