import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
}) {
  const variantClass = {
    login: {
      styles: "bg-blue-600 text-white hover:bg-blue-700",
      animation: {
        hover: { scale: 1.1, backgroundColor: "#4a90e2" },
      },
    },
    primary: {
      styles: "bg-blue-600 text-white hover:bg-blue-700",
      animation: {
        hover: { scale: 1.2 },
        tap: { scale: 0.9 },
      },
    },
    danger: {
      styles: "bg-red-600 text-white hover:bg-red-700",
      animation: {
        hover: { scale: 1.1, backgroundColor: "#ff4d4d" },
        tap: { scale: 0.95, backgroundColor: "#e60000" },
      },
    },
    secondary: {
      styles: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      animation: {
        hover: { scale: 1.05, opacity: 0.9 },
        tap: { scale: 0.95, opacity: 1 },
      },
    },
    outline: {
      styles: "border border-gray-400 text-gray-800 hover:bg-gray-100",
      animation: {
        hover: { scale: 1.1, borderColor: "#000" },
        tap: { scale: 0.95, borderColor: "#555" },
      },
    },
  };

  // Base styles for the button
  const baseStyles =
    "px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Get the styles and animation for the current variant
  const { styles, animation } = variantClass[variant] || variantClass.primary;

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${styles} ${className}`}
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
  variant: PropTypes.oneOf([
    "login",
    "primary",
    "danger",
    "secondary",
    "outline",
  ]),
};
