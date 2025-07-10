import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../icons/icon';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ navigations, activeNav, isOpen, onClose }) {
  // Sidebar content as a function to avoid code duplication
  const SidebarContent = () => (
    <div className="h-screen xl:w-80 p-4 box-border overflow-y-auto">
      <div className="h-full w-full rounded-lg z-0 bg-white shadow-md">
        <div className="h-full w-full text-primary-800 flex flex-col">
          {/* Header */}
          <div className="flex justify-between md:justify-center items-center py-6 px-4">
            <img src="/assets/logo.png" alt="Logo-Tanamin" className="h-10 lg:h-16" />
            <button className="lg:hidden text-black" onClick={onClose}>
              <Icon type="x-mark" color="black" />
            </button>
          </div>
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col">
              {navigations &&
                navigations.map((navigation, index) => (
                  <li key={index} className="p-4">
                    <p className="text-md font-semibold mb-2">
                      {navigation.label
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                    </p>
                    <div className="flex flex-col gap-2">
                      {navigation.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.href}
                          className={` hover:bg-primary-800 text-black py-2 px-4 rounded flex items-center ${
                            activeNav === link.text
                              ? 'bg-primary-800 border-l-4 border-primary-700'
                              : 'border border-primary-800'
                          }`}
                        >
                          {link.icon && (
                            <Icon
                              type={link.icon}
                              className="size-5"
                              color={activeNav === link.text ? 'white' : 'black'}
                            />
                          )}
                          <p
                            className={`px-2 font-normal text-lg ${
                              activeNav === link.text ? 'text-white' : ''
                            }`}
                          >
                            {link.text
                              .split(' ')
                              .map(
                                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                              )
                              .join(' ')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Overlay & Animated Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-gray-400 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: isOpen ? 0 : '-100%' }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-screen z-40 w-[20rem] max-w-full lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Desktop: Static Sidebar */}
      <div
        className="hidden lg:block lg:relative lg:h-screen lg:z-40"
        style={{ width: '20rem', maxWidth: '100vw' }}
      >
        <SidebarContent />
      </div>
    </>
  );
}
