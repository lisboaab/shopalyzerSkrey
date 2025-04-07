import React from "react";
import "../app/globals.css";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-100 w-full">
      <div className=" flex flex-col items-center bg-electric50 p-8 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#0D0DFC"
          className="size-12 mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>

        <p className="worksans-semibold main text-2xl">Oh no...</p>
        <p className="worksans main text-md">There is nothing here!</p>
      </div>
    </div>
  );
};

export default EmptyState;
