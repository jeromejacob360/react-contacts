import React from 'react';
import { Link } from 'react-router-dom';
import Contact from '../components/Contact';
import { FaPlus } from 'react-icons/fa';

export default function Home({ contacts, currentUser, loading, setLoading }) {
  if (loading) {
    return null;
  }
  return (
    <div className="max-w-screen-xl mt-28 mx-auto">
      {!loading && contacts.length === 0 ? (
        <div className="text-xl text-center text-indigo-500">
          You don't have any contacts yet..!
        </div>
      ) : (
        <div className="space-y-4 shadow-xl border m-4 p-4 border-indigo-600 rounded-md">
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
      <div className="fixed left-0 bottom-4 flex justify-end right-4 max-w-screen-xl mx-auto">
        <Link
          to="/new"
          className="text-white bg-indigo-600 rounded-full shadow-md"
        >
          <FaPlus size={50} className="text-white p-2" />
        </Link>
      </div>
    </div>
  );
}
