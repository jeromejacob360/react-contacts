import React from "react";
import { Link } from "react-router-dom";
import Contact from "../components/Contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Home({ contacts, currentUser }) {
  if (contacts.length === 0) {
  }
  return (
    <>
      {contacts.length === 0 ? (
        <div className="text-xl text-center text-indigo-500">
          You don't have any contacts yet..!
        </div>
      ) : (
        <div className="max-w-screen-lg px-4 pb-4 mx-auto space-y-4 border-indigo-600 rounded-md shadow-lg">
          <div className="flex justify-between pl-2 my-4 border-b border-blue-500 sm:pl-12">
            <div className="grid items-center flex-1 grid-cols-2 mx-5 my-2 space-x-2 sm:grid-cols-3 md:grid-cols-4">
              <h4>Name</h4>
              <h5>Phone</h5>
              <h5 className="hidden sm:block">Email</h5>
              <h5 className="hidden md:block">Notes</h5>
            </div>
          </div>
          {contacts?.map((contact) => (
            <Contact
              currentUser={currentUser}
              contact={contact}
              key={contact.email}
            />
          ))}
        </div>
      )}
      <Link
        to="/new"
        className="fixed grid w-16 h-16 text-white bg-indigo-600 rounded-full shadow-md place-items-center bottom-10 right-10"
      >
        <FontAwesomeIcon icon={faPlus} size="2x" className="text-white" />
      </Link>
    </>
  );
}
