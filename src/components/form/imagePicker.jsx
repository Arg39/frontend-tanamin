import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

export default function ImagePicker({
  label,
  name,
  onChange,
  preview,
  crop = false,
  cropAspect = 1,
  disabled = false,
}) {
  const [localPreview, setLocalPreview] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [cropState, setCropState] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (!preview) {
      setLocalPreview(null);
    } else if (typeof preview === 'string') {
      if (
        preview.startsWith('blob:') ||
        preview.startsWith('data:') ||
        preview.startsWith('http')
      ) {
        setLocalPreview(preview);
      } else {
        setLocalPreview(`${process.env.REACT_APP_BACKEND_BASE_URL}/storage/${preview}`);
      }
    } else if (preview instanceof File) {
      const url = URL.createObjectURL(preview);
      setLocalPreview(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const handleFileChange = (e) => {
    if (disabled) return;
    const file = e.target.files[0];
    if (file) {
      setInputKey(Date.now());
      if (crop) {
        setRawFile(file);
        setLocalPreview(URL.createObjectURL(file));
        setCropState({ x: 0, y: 0 });
        setZoom(1);
        setShowCrop(true);
      } else {
        setLocalPreview(URL.createObjectURL(file));
        onChange(e);
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    const croppedImage = await getCroppedImg(localPreview, croppedAreaPixels);
    setLocalPreview(croppedImage.url);
    setShowCrop(false);

    // Convert blob to File and trigger onChange
    const croppedFile = new File([croppedImage.blob], rawFile.name, { type: rawFile.type });
    const event = {
      target: {
        name,
        files: [croppedFile],
      },
    };
    onChange(event);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className={`mb-2 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <div
        className={`border rounded-md px-3 py-6 focus:outline-none flex items-center justify-center relative h-48
          ${
            disabled
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
              : 'border-gray-300 focus:ring-2 focus:ring-primary-500'
          }`}
      >
        {localPreview ? (
          <img src={localPreview} alt="Preview" className="max-h-full object-contain" />
        ) : (
          <span className={`text-center ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            Drag and drop an image here or click to select
          </span>
        )}
        <input
          key={inputKey}
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        />
      </div>
      {crop && showCrop && !disabled && (
        <div className="fixed inset-0 bg-black-900 bg-opacity-60 flex items-center justify-center z-100 crop-overlay">
          <div className="bg-white-100 p-4 rounded shadow-lg relative w-[90vw] max-w-lg h-[60vw] max-h-[80vh] flex flex-col">
            <div className="relative flex-1">
              <Cropper
                image={localPreview}
                crop={cropState}
                zoom={zoom}
                aspect={cropAspect}
                onCropChange={setCropState}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowCrop(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary-500 text-white-100 rounded"
                onClick={handleCropSave}
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ImagePicker.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(File),
    PropTypes.oneOf([null]),
  ]),
  crop: PropTypes.bool,
  cropAspect: PropTypes.number,
  disabled: PropTypes.bool,
};
