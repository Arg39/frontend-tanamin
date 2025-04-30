import React from 'react';
import Icon from '../icons/icon';

export default function MiniCard({ course, content = 'true' }) {
  return (
    <div className="w-[400px] h-[460px] bg-white rounded-xl shadow-2xl">
      {content && (
        <>
          <div className="flex justify-center items-center">
            <img
              src={course.image}
              alt={course.title}
              className="rounded-md mt-6"
              style={{ width: '340px', height: '220px', objectFit: 'cover' }}
            />
          </div>
          <div className="px-8 ">
            <div className="flex justify-between items-center mt-4">
              <div className="w-5/6 flex-row justify-center">
                <h2 className="mt-4 w-full font-medium text-xl line-clamp-3">{course.title}</h2>
              </div>
              <div className="w-1/6 flex justify-end">
                <Icon type={'arrow-right'} className="h-6 w-6 text-black" />
              </div>
            </div>
            <div className="mt-4 flex">
              <p className="font-semibold text-lg text-gray-500">
                Rp {course.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
