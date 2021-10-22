import React from "react";
import { Link } from "react-router-dom";
import Contact from "./Contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Contacts({ contacts, setNewContact, setLockEmail }) {
  return (
    <div className="max-w-screen-lg px-4 pb-4 mx-auto space-y-4 border-indigo-600 rounded-md shadow-lg group ">
      <div className="flex justify-between pl-2 my-4 border-b sm:pl-12">
        <div className="grid items-center flex-1 grid-cols-2 mx-5 my-2 space-x-2 sm:grid-cols-3 md:grid-cols-4">
          <h4>Name</h4>
          <h5>Phone</h5>
          <h5 className="hidden sm:block">Email</h5>
          <h5 className="hidden md:block">Notes</h5>
        </div>
      </div>
      {contacts?.map((contact) => (
        <Contact
          setNewContact={setNewContact}
          setLockEmail={setLockEmail}
          contact={contact}
          key={contact.email}
        />
      ))}
      <Link
        to="/new"
        className="fixed grid w-20 h-20 text-white bg-indigo-600 rounded-full shadow-md place-items-center bottom-10 right-10"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" className="text-white" />
      </Link>
    </div>
  );
}
