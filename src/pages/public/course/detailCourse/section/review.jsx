import React, { useRef, useState, useEffect } from 'react';
import ReviewCard from '../../../../../components/card/reviewCard';
import useStudentCourseStore from '../../../../../zustand/studentCourseStore';
import { useParams } from 'react-router-dom';

export default function ReviewCourseDetail({ sectionRef, course, maxHeight = null }) {
  const containerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const courseId = course?.id;

  const { reviews, reviewsLoading, reviewsError, fetchReviews } = useStudentCourseStore();

  useEffect(() => {
    if (courseId) {
      fetchReviews(courseId, { page: 1, perPage: 5 }); // limit to 5 reviews for featured
    }
  }, [courseId, fetchReviews]);

  useEffect(() => {
    if (!containerRef.current || !maxHeight) {
      setClamped(false);
      return;
    }
    setClamped(containerRef.current.scrollHeight > maxHeight);
  }, [reviews, maxHeight]);

  return (
    <div
      ref={sectionRef}
      className="bg-white p-3 sm:p-8 rounded-lg shadow-lg scroll-mt-28 relative"
      id="review"
    >
      <p className="text-xl sm:text-2xl font-bold text-primary-700 mb-2 pb-1 border-b-2 border-primary-700">
        Ulasan Unggulan
      </p>
      <div
        ref={containerRef}
        className="mt-3 sm:mt-4 flex flex-col gap-3 sm:gap-4 transition-all duration-300"
        style={
          maxHeight && !expanded && clamped
            ? { maxHeight, overflow: 'hidden', position: 'relative' }
            : {}
        }
      >
        {reviewsLoading && <div>Loading...</div>}
        {reviewsError && <div className="text-red-500">{reviewsError}</div>}
        {!reviewsLoading && reviews.length === 0 && (
          <div className="text-gray-500">Belum ada ulasan.</div>
        )}
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            user={review.user}
            rating={review.rating}
            comment={review.comment}
            created_at={review.created_at}
          />
        ))}
      </div>
      {maxHeight && !expanded && clamped && (
        <>
          <div
            className="absolute left-0 right-0 bottom-0 h-32 sm:h-40 pointer-events-none rounded-b-lg"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 60%)',
            }}
          />
          <button
            className="absolute left-4 sm:left-8 bottom-2 mb-2 sm:mb-4 px-4 py-2 bg-primary-700 text-white rounded-md text-xs sm:text-sm font-medium shadow-lg hover:bg-primary-800 transition-colors z-10"
            style={{ width: 'fit-content' }}
            onClick={() => setExpanded(true)}
          >
            Baca selengkapnya...
          </button>
        </>
      )}
    </div>
  );
}
