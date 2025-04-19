import React from "react";
import "../app/globals.css";

const ForbiddenAccess: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-10 gap-4">
      <div className=" flex items-center bg-red600 p-4 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="size-12 animation-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="worksans-semibold text-red-700 text-2xl">
          Wait...
        </p>
        <p className="worksans text-md">You don't have access to this page!</p>
      </div>
    </div>
  );
};

export default ForbiddenAccess;
