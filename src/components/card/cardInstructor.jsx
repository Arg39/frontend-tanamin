import React from 'react';
import Icon from '../icons/icon';

// Card for each instructor
export function InstructorCard({ id, image, name, expertise, courseCount, onClick }) {
  return (
    <button
      type="button"
      tabIndex={0}
      aria-label={`Lihat detail instruktur ${name}`}
      className="bg-white rounded-xl flex-none flex flex-col items-center p-4 sm:p-6 w-[45vw] sm:w-64 mx-0 sm:mx-2 focus:outline-primary-500 transition-all"
      style={{ boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.2)' }}
      onClick={() => onClick && onClick(id)}
    >
      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-primary-900 bg-white">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover"
          />
        ) : (
          <Icon type="user" className="w-10 h-10 sm:w-12 sm:h-12" />
        )}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-primary-900 text-center">{name}</h3>
      <p className="text-center text-primary-700 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
        {expertise}
      </p>
      <span className="text-xs text-gray-500">{courseCount} Course</span>
    </button>
  );
}
