"use client";
import { useRouter } from "next/navigation";
import React from "react";
import "../app/globals.css";
import ButtonDeleteDialog from "./ButtonDeleteDialog";

export interface Search {
  id: number;
  title: string;
  group: string;
}
interface RecentSearchProps {
  search: Search;
}

const RecentSearch: React.FC<RecentSearchProps> = ({ search }) => {
  const router = useRouter();
  const action = () => {
    router.push(`/dashboard/${search.id}`);
  };

  return (
    <div>
      <div
        className="flex flex-row justify-between bg-blue-200/20 rounded-full pl-5 pr-5 h-10 items-center hover:bg-blue-950 group mb-2 w-50 cursor-pointer"
        onClick={action}
      >
        <p className="gellix-regular truncate max-w-35"> {search.title} </p>
        <div className="hidden group-hover:block">
          <ButtonDeleteDialog />
        </div>
      </div>
    </div>
  );
};

export default RecentSearch;
