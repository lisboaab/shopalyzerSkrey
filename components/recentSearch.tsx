"use client";
import { useRouter } from "next/navigation";
import React from "react";
import "../app/globals.css";
import type Search from "../app/interface/search";

interface RecentSearchProps {
  search: Search;
  deleteFunction: () => void;
}

const RecentSearch: React.FC<RecentSearchProps> = ({ search, deleteFunction }) => {
  const router = useRouter();
  const action = () => {
    router.push(`/dashboard/${search._id}`);
  };

  return (
    <div className="pr-2">
      <div className="flex flex-row justify-between bg-blue-200/20 rounded-full pl-5 pr-5 h-10 items-center hover:bg-blue-950 group mb-2 w-50 cursor-pointer">
        <p className="gellix-regular truncate max-w-35" onClick={action}>
          {" "}
          {search.name}{" "}
        </p>
        <div className="hidden group-hover:inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-5 cursor-pointer z-200"
            onClick={deleteFunction}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RecentSearch;
