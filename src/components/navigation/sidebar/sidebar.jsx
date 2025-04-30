import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../icons/icon';

export default function Sidebar({ navigations, activeNav, onLogout }) {
  console.log('activeNav', activeNav);
  return (
    <div className="h-screen p-2">
      <div className="h-full w-64 rounded-lg bg-white-100 text-white flex flex-col">
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
                  <p className="text-md font-semibold mb-2">{navigation.label}</p>
                  <div className="flex flex-col gap-2">
                    {navigation.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.href}
                        className={` hover:bg-primary-700 text-white text-lg py-1 px-2 rounded flex items-center ${
                          activeNav === link.text
                            ? 'bg-primary-600 border-l-4 border-primary-700'
                            : 'border border-primary-900'
                        }`}
                      >
                        {link.icon && (
                          <Icon
                            type={link.icon}
                            className="w-4 h-4"
                            color={activeNav === link.text ? 'white' : 'black'}
                          />
                        )}
                        {link.text}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
          </ul>
        </div>
        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
