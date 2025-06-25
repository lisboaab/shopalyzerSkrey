import React, { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options?: Option[];
  value?: string;
  onChange: (value: string) => void; 
  placeholder?: string;
  className?: string;
  maxHeight?: string;
};

const Select: React.FC<SelectProps> = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option",
  className = "",
  maxHeight = "240px"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayText = () => {
    if (!value) return placeholder;
    const selected = options.find(opt => opt.value === value);
    return selected?.label || placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="gellix border border-gray-200 text-gray-900 text-sm rounded-lg w-full p-3 outline-none flex justify-between items-center bg-white hover:border-gray-300 focus:border-blue-500"
      >
        <span className="truncate gellix">{getDisplayText()}</span>
        <svg 
          className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="gellix absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{ maxHeight }}
        >
          <div className="overflow-y-auto">
            {/* Options */}
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`gellix flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                  value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="mr-3 flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    value === option.value 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-300'
                  }`}>
                    {value === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className="gellix">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;