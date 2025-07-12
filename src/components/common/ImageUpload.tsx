import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileChange, label }) => {
  const [preview, setPreview] = useState<string | null>(null);

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

  return (
    <div>
      {label && <label className="block text-sm font-medium text-neutral-300 mb-1.5">{label}</label>}
      <div
        {...getRootProps()}
        className={`relative w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-custom-cyan bg-custom-cyan/10' : 'border-gray-700 hover:border-custom-cyan'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Project preview" className="w-full h-full object-cover rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1.5 text-white hover:bg-opacity-75 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <UploadCloud className="w-8 h-8" />
            <p className="font-semibold">Click to upload or drag and drop</p>
            <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;