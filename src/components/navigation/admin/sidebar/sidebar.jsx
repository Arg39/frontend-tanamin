import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../icons/icon';

export default function Sidebar({ navigations, activeNav, onLogout }) {
  console.log('activeNav', activeNav);
  return (
    <div className="h-screen p-4">
      <div className="h-full w-80 rounded-lg bg-white-100 shadow-md text-white flex flex-col">
        {/* Header */}
        <div className="flex justify-center items-center py-6">
          <img src="/assets/Logo-CodeLearn.png" alt="Logo-Tanamin" className="h-10 lg:h-16" />
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
                        className={` hover:bg-primary-800 text-white py-2 px-4 rounded flex items-center ${
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
                            activeNav === link.text ? 'text-white-100' : ''
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
  );
}
