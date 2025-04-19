// EditableField.jsx
import React, { useState } from "react";

const EditableField = ({ 
  label, 
  value, 
  onSave, 
  inputType = "text", 
  placeholder = "", 
  secondInput = null 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [secondInputValue, setSecondInputValue] = useState("");

  const handleSave = () => {
    onSave(inputValue, secondInputValue);
    setIsEditing(false);
    setSecondInputValue("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value);
    setSecondInputValue("");
  };

  return (
    <div className="flex flex-row items-start justify-between w-full">
      {!isEditing ? (
        <div className="flex flex-row gap-5 items-center justify-between w-full">
          <div className="flex flex-row gap-4 items-center">
            <h1>{label}:</h1>
            {inputType !== "password" && <h1 className="gellix-semibold w-60">{value}</h1>}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#0D0DFC"
            className="size-5 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-row w-full items-end justify-between">
          <div className="flex flex-row gap-2 items-start">
            <h1>{label}:</h1>
            <div className="flex flex-col gap-2">
              <input
                type={inputType}
                className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                value={inputValue}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {secondInput && (
                <input
                  type={inputType}
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                  placeholder={secondInput.placeholder}
                  value={secondInputValue}
                  onChange={(e) => setSecondInputValue(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center cursor-pointer">
            <div className="hover:bg-gray-100 hover:rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                className="size-5"
                onClick={handleCancel}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="hover:bg-gray-100 hover:rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="green"
                className="size-5"
                onClick={handleSave}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;