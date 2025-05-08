import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Button({ children, onClick, className = '', variant = 'primary', to }) {
  const navigate = useNavigate();

  const variantAnimations = {
    primary: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
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
    form: {
      hover: { scale: 1.05 },
      tap: { scale: 0.95 },
    },
  };

  const variantClasses = {
    primary: 'bg-primary-500 text-white rounded-full p-2 px-6',
    danger: 'bg-primary-500 text-white rounded-lg p-2 px-6',
    secondary: 'bg-gray-500 text-white rounded-lg p-2 px-6',
    outline: 'border border-blue-500 text-blue-500 rounded-lg p-2 px-6',
    form: 'bg-primary-800 text-white-100 px-8 py-2 rounded-md hover:bg-primary-900',
  };

  const combinedClassName = `${
    variantClasses[variant] || variantClasses.primary
  } ${className}`.trim();

  const handleClick = (event) => {
    if (to) {
      const absolutePath = to.startsWith('/') ? to : `/${to}`;
      navigate(absolutePath);
    }
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={combinedClassName}
      whileHover="hover"
      whileTap="tap"
      variants={variantAnimations[variant] || variantAnimations.primary}
    >
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['login', 'primary', 'danger', 'secondary', 'outline', 'form']),
  to: PropTypes.string,
};
