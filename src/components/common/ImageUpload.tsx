import React, { useState, useCallback, useEffect } from 'react'; // Added useEffect
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  label?: string;
  currentImageUrl?: string; // Added currentImageUrl prop
  variant?: 'default' | 'circle'; // Added variant prop
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileChange, label, currentImageUrl, variant = 'default' }) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Set initial preview from currentImageUrl
  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileChange(null);
  };

  const isCircle = variant === 'circle';

  return (
    <div>
      {label && <label className={`block text-sm font-medium ${isCircle ? 'text-white' : 'text-neutral-300'} mb-2`}>{label}</label>}
      <div
        {...getRootProps()}
        className={`relative ${isCircle ? 'w-40 h-40 mx-auto' : 'w-full h-48'} border-2 border-dashed ${isCircle ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-custom-cyan bg-custom-cyan/10' : 'border-gray-700 hover:border-custom-cyan'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className={`relative w-full h-full ${isCircle ? 'overflow-hidden rounded-full' : ''}`}>
            <img src={preview} alt="Preview" className={`w-full h-full object-cover ${isCircle ? 'rounded-full' : 'rounded-lg'}`} />
            <button
              onClick={removeImage}
              className={`absolute ${isCircle ? 'top-0 right-0' : 'top-2 right-2'} bg-black bg-opacity-50 rounded-full p-1.5 text-white hover:bg-opacity-75 transition-colors`}
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className={`flex flex-col items-center ${isCircle ? 'gap-1' : 'gap-2'} text-neutral-400`}>
            <UploadCloud className={isCircle ? 'w-6 h-6' : 'w-8 h-8'} />
            {!isCircle && (
              <>
                <p className="font-semibold">Click to upload or drag and drop</p>
                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </>
            )}
            {isCircle && <p className="text-xs mt-1">Upload</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
