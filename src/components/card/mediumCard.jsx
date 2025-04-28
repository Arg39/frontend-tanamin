import React from 'react';
import Icon from '../icon/iconHeroicons';

export default function MediumCard({ course }) {
  return (
    <div className="w-full md:w-[300px] h-auto md:h-[420px] bg-white rounded-xl shadow-2xl">
      <div className="flex justify-center items-center">
        <img
          src={course.image}
          alt={course.title}
          className="rounded-md mt-6"
          style={{ width: '90%', height: 'auto', objectFit: 'cover' }}
        />
      </div>
      <div className="w-full px-4 md:px-6 mt-4 flex-row justify-center">
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  type={'star'}
                  className={`h-4 w-4 ${
                    index < course.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="ml-2 font-light text-sm">({course.participant})</p>
          </div>
          <Icon type={'bookmark'} className="h-5 w-5 text-black" />
        </div>

        <h2 className="mt-4 font-medium text-lg line-clamp-3">{course.title}</h2>

        <div className="mt-4 flex justify-between text-gray-600">
          <div className="flex w-full">
            <Icon type={'book'} className="h-5 w-5 mr-2" />
            <p className="font-light">{course.lotMaterial} Materi</p>
          </div>
          <div className="flex w-full">
            <Icon type={'clock'} className="h-5 w-5 mr-2" />
            <p className="font-light">{course.duration} Jam Total</p>
          </div>
        </div>
        <p className="mt-4 font-medium">{course.instructor}</p>
        <div className="mt-4 flex">
          <p className="font-semibold text-xl">Rp {course.price.toLocaleString('id-ID')}</p>
          <p
            className="font-semibold text-md line-through ml-2 text-gray-500"
            style={{ textDecorationThickness: '2px' }}
          >
            Rp {course.priceBeforeDiscount.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
}
