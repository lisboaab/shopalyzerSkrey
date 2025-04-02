import React from "react";
import ButtonAnimation from "./buttonAnimation";
import Image from "next/image";
import RecentSearch from "./recentSearch";

interface NavBarProps {
  buttonFunction: () => void;
}

const NavBarExpanded: React.FC<NavBarProps> = ({ buttonFunction }) => {
  const log = () => {
    console.log("clicked");
  };
  const searches = [
    "Bershka monthly",
    "Pull&Bear Sales",
    "Bershka Christmas",
    "Comparison Bershka and"
  ]
  return (
      <div className="flex flex-col items-center gap-10 justify-between">
        {/* Hamburguer menu icon + logo */}
        <div className="flex flex-row justify-between items-center w-full">
          <Image
            src="/logoWhite2.svg"
            alt="Shopalyzer white logo"
            width={120}
            height={100}
          />
          <button onClick={buttonFunction}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Main buttons */}
        <div className="flex flex-col gap-4">
          {/* New search button */}
          <ButtonAnimation
            label="New Search"
            color="#0D0DFC"
            backgroundColor="white"
            action={log}
            icon="add"
          />

          {/* Saved searches button */}
          <ButtonAnimation
            label="Saved Searches"
            color="white"
            backgroundColor="#0D0DFC20"
            action={log}
            icon="bookmark"
            style="outline"
          />
        </div>

        {/* Recent searches */}
        <div className="w-full justify-self-start">
          <h2 className="gellix-semibold">Recent searches</h2>
          <RecentSearch action={log} label="Search 01"/>
        </div>
      </div>
  );
};

export default NavBarExpanded;
