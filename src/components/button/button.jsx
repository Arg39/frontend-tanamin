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

  // Define classNames for each variant
  const variantClasses = {
    login: 'bg-blue-500 text-white rounded-lg p-2 px-4',
    primary: 'bg-blue-500 text-white rounded-lg p-2 px-4',
    danger: 'bg-blue-500 text-white rounded-lg p-2 px-4',
    secondary: 'bg-blue-500 text-white rounded-lg p-2 px-4',
    outline: 'bg-blue-500 text-white rounded-lg p-2 px-4',
  };

  // Get the animation and className for the current variant
  const animation = variantAnimations[variant] || variantAnimations.primary;
  const variantClassName = variantClasses[variant] || variantClasses.primary;

  return (
    <motion.button
      onClick={onClick}
      className={`custom-button ${variantClassName} ${className}`}
      whileHover="hover"
      whileTap="tap"
      variants={animation}
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
