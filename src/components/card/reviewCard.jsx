import React from 'react';
import StarRating from '../content/star/star';

export default function ReviewCard() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-primary-700">
      <img
        className="w-16 h-16 sm:w-32 sm:h-32 rounded-md object-cover mb-2 sm:mb-0"
        src="https://i.pinimg.com/736x/77/fa/d8/77fad8f6ab6740147dbfbe54c61f9381.jpg"
        alt=""
      />
      <div className="flex-1">
        <p className="text-primary-700 font-semibold text-base sm:text-lg">Dhirma Putri</p>
        <div className="flex flex-row gap-2 items-center mb-1">
          <StarRating value={4} size={5} />
          <p className="text-xs sm:text-sm text-gray-500">07/03/25</p>
        </div>
        <p className="text-sm sm:text-base">
          Course-nya menarik dan cukup kompleks dari segi materi, tapi instruktur bisa menjelaskan
          dengan cara yang mudah untuk dipahami
        </p>
      </div>
    </div>
  );
}
