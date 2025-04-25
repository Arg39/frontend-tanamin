import React, { useState } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg ${
          loaded ? "hidden" : "block"
        }`}
      >
        <div className="w-full h-full bg-gray-300 rounded-lg"></div>
      </div>
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 rounded-lg ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;
