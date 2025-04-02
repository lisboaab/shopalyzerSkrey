import React from "react";

interface NavBarProps {
  buttonFunction: () => void;
}

const NavBarCollapsed: React.FC<NavBarProps> = ({ buttonFunction }) => {
  return (
    <div className="flex flex-col items-center gap-10">
      {/* Hamburguer menu icon */}
      <button onClick={buttonFunction} className="group">
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
        <span className="bg-white w-fit border-md group-hover:scale-100">Open side menu</span>
      </button>

      {/* Main Buttons */}
      <div className="flex flex-col gap-4 ">
        {/* New search button */}
        <div className="bg-white rounded-full flex items-center justify-center h-10 w-10">
          <a href="/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#0D0DFC"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </a>
        </div>

        {/* Saved searches button */}
        <div className="border-2 border-white rounded-full flex items-center justify-center h-10 w-10">
          <a href="/saved">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBarCollapsed;
