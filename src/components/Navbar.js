import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

export default function Navbar() {
  return (
    <nav className="h-16 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <FontAwesomeIcon icon={faBars} />
        <img src="logo.png" alt="" />
        <Link to="/">
          <span className="text-gray-700 text-xl">Contacts</span>
        </Link>
      </div>
      <Search />
    </nav>
  );
}
