import React from 'react';
import Icon from '../icons/icon';

export default function Card({ course, content = 'true' }) {
  return (
    <div className="w-[300px] lg:w-[400px] h-[480px] lg:h-[560px] bg-white-100 rounded-xl shadow-2xl">
      {content && (
        <>
          <div className="flex justify-center items-center">
            <img
              src={course.image}
              alt={course.title}
              className="rounded-md mt-6"
              style={{ width: '90%', height: '180px', objectFit: 'cover' }}
            />
          </div>
          <div className="w-full px-4 lg:px-8 mt-4 flex-row justify-center">
            <div className="h-full flex justify-between items-center">
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      key={index}
                      type={'star'}
                      className={`h-4 w-4 lg:h-5 lg:w-5 ${
                        index < course.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="ml-2 font-light text-xs lg:text-sm">({course.participant})</p>
              </div>
              <Icon type={'bookmark'} className="h-5 w-5 lg:h-6 lg:w-6 text-black" />
            </div>

            <h2 className="mt-4 font-medium text-lg lg:text-xl line-clamp-3">{course.title}</h2>

            <div className="mt-4 flex justify-between text-gray-600">
              <div className="flex w-full">
                <Icon type={'book'} className="h-5 w-5 lg:h-6 lg:w-6 mr-2" />
                <p className="font-light text-xs lg:text-sm">{course.lotMaterial} Materi</p>
              </div>
              <div className="flex w-full">
                <Icon type={'clock'} className="h-5 w-5 lg:h-6 lg:w-6 mr-2" />
                <p className="font-light text-xs lg:text-sm">{course.duration} Jam Total</p>
              </div>
            </div>
            <p className="mt-4 font-medium text-sm lg:text-base">{course.instructor}</p>
            <div className="mt-4 flex">
              <p className="font-semibold text-lg lg:text-2xl">
                Rp {course.price.toLocaleString('id-ID')}
              </p>
              <p
                className="font-semibold text-sm lg:text-lg line-through ml-2 text-gray-500"
                style={{ textDecorationThickness: '2px' }}
              >
                Rp {course.priceBeforeDiscount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
