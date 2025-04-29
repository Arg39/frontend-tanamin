import React from 'react';
import { motion } from 'framer-motion';

const GradientText = ({
  children,
  className = '', // Tailwind classes for gradient colors
  duration = 3, // Animation duration in seconds
  fontSize = '2rem', // Default font size
  fontWeight = 'bold', // Default font weight
}) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight,
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'], // Animate gradient position
      }}
      transition={{
        duration,
        repeat: Infinity, // Loop animation
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;
