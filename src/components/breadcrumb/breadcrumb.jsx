import React from 'react';

const Breadcrumb = ({ label, text }) => {
  // Capitalize the first letter of each word
  const capitalize = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="flex items-end mb-4">
      <p className="text-md text-primary-700">
        {capitalize(label)} /<span>&nbsp;</span>
        <span className="text-2xl text-primary-800 font-bold">{capitalize(text)}</span>
      </p>
    </div>
  );
};

export default Breadcrumb;
