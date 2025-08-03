import React from 'react';
import StarRating from './star';

export function RatingSummary({ summary }) {
  // summary: { 5: count, 4: count, ... }
  const total = Object.values(summary).reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex flex-col gap-2 w-full">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = summary[star] || 0;
        const percent = Math.round((count / total) * 100);
        return (
          <div key={star} className="flex items-center gap-2 sm:gap-3 w-full">
            <div className="min-w-[48px] sm:min-w-[60px] flex items-center gap-1">
              <StarRating value={star} size={5} />
            </div>
            <div className="flex-1 h-2 sm:h-3 bg-gray-200 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-primary-700 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="min-w-[32px] sm:min-w-[40px] text-right text-xs sm:text-sm font-semibold text-primary-700">
              {percent}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
