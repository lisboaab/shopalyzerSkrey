import React, { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options?: Option[];
  value?: string[];
  onChange: any;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = "Select options",
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

  const handleToggle = (optionValue: any) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    const allValues = options.map(opt => opt.value);
    onChange(value.length === options.length ? [] : allValues);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === options.length) return "All selected";
    if (value.length === 1) {
      const selected = options.find(opt => opt.value === value[0]);
      return selected?.label || `${value.length} selected`;
    }
    return `${value.length} selected`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="gellix border border-gray-200 text-gray-900 text-sm rounded-lg w-full p-3 gellix outline-none flex justify-between items-center bg-white hover:border-gray-300 focus:border-blue-500"
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
            {/* Select All */}
            <label className="gellix flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
              <input
                type="checkbox"
                checked={value.length === options.length && options.length > 0}
                onChange={handleSelectAll}
                className="gellix mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="font-medium text-gray-700">Select All</span>
            </label>

            {/* Options */}
            {options.map((option) => (
              <label 
                key={option.value} 
                className="gellix flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="gellix mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="gellix text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;