import React from "react";
import "../app/globals.css";
import { useRouter } from "next/navigation";

import ButtonAnimation from "./buttonAnimation";

const NotFound: React.FC = () => {
    const router = useRouter();
  
  return (
    <div className="flex inset-0 z-500 flex-col items-center justify-center h-full w-full p-10 gap-4">
      <div className=" flex items-center bg-gray-100 p-4 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#414653"
          className="size-12 animate-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="worksans-semibold text-gray-700 text-2xl">Content not found</p>
        <ButtonAnimation
            label="Go to home"
            color="#414653"
            style="outline"
            action={() => router.push(`/new`)}
            icon="arrow"
            width="12em"
          />
      </div>
    </div>
  );
};

export default NotFound;
