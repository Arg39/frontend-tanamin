import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function Button({ children, onClick, className = '', variant = 'primary' }) {
  const variantAnimations = {
    login: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
    },
    primary: {
      hover: { scale: 1.2 },
      tap: { scale: 0.9 },
    },
    danger: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
    },
    secondary: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
    outline: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
    },
  };

  // Define default Tailwind classes for each variant
  const variantClasses = {
    login: 'bg-primary-500 text-white rounded-full p-2 px-6',
    primary: 'bg-blue-500 text-white rounded-lg p-2 px-6',
    danger: 'bg-primary-500 text-white rounded-lg p-2 px-6',
    secondary: 'bg-gray-500 text-white rounded-lg p-2 px-6',
    outline: 'border border-blue-500 text-blue-500 rounded-lg p-2 px-6',
  };

  // Combine default styles with additional styles from `className`
  const combinedClassName = `${
    variantClasses[variant] || variantClasses.primary
  } ${className}`.trim();

  return (
    <motion.button
      onClick={onClick}
      className={combinedClassName} // Use combined styles
      whileHover="hover"
      whileTap="tap"
      variants={variantAnimations[variant] || variantAnimations.primary}
    >
      {children}
    </motion.button>
  );
}

// Define PropTypes for better type checking
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['login', 'primary', 'danger', 'secondary', 'outline']),
};
