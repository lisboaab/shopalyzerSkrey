"use client";
import "../app/globals.css";
import { useState } from "react";

interface Props {
  action: (value: "asc" | "desc") => void;
}

const SortItem: React.FC<Props> = ({ action }) => {
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const handleSort = () => {
    const newDirection = direction === "asc" ? "desc" : "asc";
    setDirection(newDirection);
    action(newDirection);
  };

  return (
    <div
      className="flex flex-col items-center justify-center hover:cursor-pointer"
      onClick={handleSort}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-4 ${direction === "desc" ? "rotate-180" : ""}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
        />
      </svg>
    </div>
  );
};

export default SortItem;