import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

export default function Navbar({ setContacts, contacts }) {
  return (
    <nav className="h-16 flex items-center justify-between space-x-8 max-w-screen-md w-full mx-auto px-4">
      <div className="flex items-center space-x-4">
        <FontAwesomeIcon icon={faBars} />
        <img src="logo.png" alt="" />
        <Link to="/">
          <span className="text-gray-700 text-xl">Contacts</span>
        </Link>
      </div>
      <Search setContacts={setContacts} contacts={contacts} />
    </nav>
  );
}
