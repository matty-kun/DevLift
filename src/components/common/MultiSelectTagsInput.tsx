import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface MultiSelectTagsInputProps {
  label: string;
  availableOptions: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

const MultiSelectTagsInput: React.FC<MultiSelectTagsInputProps> = ({
  label,
  availableOptions,
  selectedOptions,
  onChange,
  placeholder = 'Select skills...',
  disabled = false,
  error = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = availableOptions.filter(
    (option) =>
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedOptions.includes(option)
  );

  const handleAddOption = (option: string) => {
    const newSelectedOptions = [...selectedOptions, option];
    onChange(newSelectedOptions);
    setInputValue('');
    setShowDropdown(false);
  };

  const handleRemoveOption = (option: string) => {
    const newSelectedOptions = selectedOptions.filter((s) => s !== option);
    onChange(newSelectedOptions);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-300 mb-1.5">{label}</label>
      <div
        className={`flex flex-wrap gap-2 p-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-700'} bg-gray-900 focus-within:ring-2 focus-within:ring-custom-cyan/50 focus-within:border-custom-cyan transition`}
      >
        {selectedOptions.map((option) => (
          <span
            key={option}
            className="flex items-center bg-custom-cyan text-white text-xs px-2 py-1 rounded-full"
          >
            {option}
            {!disabled && (
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveOption(option)}
              />
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 min-w-[100px] bg-transparent text-white placeholder-neutral-500 focus:outline-none"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          disabled={disabled}
        />
      </div>

      {showDropdown && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-neutral-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto custom-scrollbar"
        >
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-white hover:bg-custom-cyan/30 cursor-pointer"
              onClick={() => handleAddOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectTagsInput;
