import { getAuth } from "@firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import Search from "./Search";

export default function Navbar({ setContacts, contacts }) {
  async function signout() {
    await getAuth().signOut();
  }
  return (
    <section className="w-screen h-20 mb-10 shadow-md">
      <nav className="flex items-center justify-between w-full h-20 max-w-screen-lg px-4 mx-auto space-x-2">
        <div className="flex items-center space-x-4">
          <Link className="flex items-center space-x-2" to="/">
            <img src="logo.png" className="hidden xs:block" alt="" />
            <span className="hidden text-xl text-gray-700 sm:block">
              Contacts
            </span>
          </Link>
        </div>
        <Search setContacts={setContacts} contacts={contacts} />
        <button
          className="px-3 py-1 text-indigo-600 border-2 border-indigo-600 rounded-md shadow-md"
          onClick={signout}
        >
          Signout
        </button>
      </nav>
    </section>
  );
}
