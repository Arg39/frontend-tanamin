import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../card/card';

const coursesMock = [
  {
    image: 'https://img-c.udemycdn.com/course/750x422/3562677_668e.jpg',
    title: 'Full Stack Web Development using JavaScript',
    rating: 4,
    lotMaterial: 3,
    duration: 4,
    participant: 100,
    instructor: 'John Doe',
    price: 199000,
    priceBeforeDiscount: 399000,
  },
  {
    image:
      'https://i.ytimg.com/vi/-I1s6WqLOF4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAysWK2u0R3BOXMpJKwqBWOtYhTKg',
    title: 'Master Laravel for create RESTful API',
    rating: 5,
    lotMaterial: 5,
    duration: 10,
    participant: 200,
    instructor: 'Jane Smith',
    price: 299000,
    priceBeforeDiscount: 499000,
  },
  {
    image:
      'https://www.rabitsolutions.com/wp-content/uploads/2023/09/typescript-cover-cropped-1300x600.jpeg',
    title: 'TypeScript from Zero to Hero',
    rating: 4,
    lotMaterial: 4,
    duration: 6,
    participant: 150,
    instructor: 'Albert Yu',
    price: 249000,
    priceBeforeDiscount: 349000,
  },
];

export default function StackedCards({ count = 3 }) {
  const [stackedCourses, setStackedCourses] = useState(Array(count).fill(coursesMock[0]));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextCourse = coursesMock[(activeIndex + 1) % coursesMock.length];
      setStackedCourses((prev) => {
        const newStack = [...prev.slice(1), nextCourse];
        return newStack;
      });
      setActiveIndex((prev) => (prev + 1) % coursesMock.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <div className="relative flex justify-center items-start w-full h-full">
      {stackedCourses.map((course, index) => {
        const zIndex = index + 1;
        const offset = stackedCourses.length - 1 - index;

        return (
          <motion.div
            key={course.title + index}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute"
            style={{
              zIndex,
              marginLeft: `${offset * 10}px`,
              marginBottom: `${offset * 4}px`,
              transform: `rotate(${offset * 2.5}deg)`,
            }}
          >
            <Card course={course} content={index === stackedCourses.length - 1} />
          </motion.div>
        );
      })}
    </div>
  );
}
