"use client";

import "../app2/app/globals.css";
import React from "react";
import { useState } from "react";
import NavBarCollapsed from "./navBarCollapsed";
import NavBarExpanded from "./navBarExpanded";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`bg-main w-fit text-white justify-between p-5 sticky top-0 z-100 h-lvh flex flex-col items-center ${isMenuOpen ? 'translate-x--1' : 'translate-x-0'} ease-in-out duration-200`}>
      {/* Nav bar */}
      {isMenuOpen ? (
        <NavBarExpanded buttonFunction={toggleMenu} />
      ) : (
        <NavBarCollapsed buttonFunction={toggleMenu} />
      )}
    </div>
  );
};

export default NavBar;