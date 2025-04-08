import React from "react";
import "../app/globals.css";

const EmptyState: React.FC = () => {
  return (
    <div className="flex inset-0 z-500 flex-col items-center justify-center h-full w-full p-10 gap-4">
      <div className=" flex items-center bg-electric50 p-4 rounded-full animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#0D0DFC"
          className="size-12 animate-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="worksans-semibold main text-2xl animate-pulse">Oh no...</p>
        <p className="worksans text-md">There is nothing here!</p>
      </div>
    </div>
  );
};

export default EmptyState;
