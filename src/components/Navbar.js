import { getAuth } from '@firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import logo from '../images/logo.png';
import { ImSpinner2 } from 'react-icons/im';

export default function Navbar({ setContacts, contacts, loading }) {
  const [user, setUser] = useState(false);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else setUser(false);
    });
  }, []);

  async function signout() {
    await getAuth().signOut();
  }
  return (
    <section className="w-screen h-20 fixed top-0 bg-white shadow-md">
      <nav className="flex items-center justify-between w-full h-20 max-w-screen-lg px-4 mx-auto space-x-2">
        <div className="hidden sm:flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 relative">
            <img
              src={logo} //TODO add user DP here
              className="object-cover w-16 h-16 rounded-full"
              alt=""
            />
            {loading && (
              <ImSpinner2
                size={68}
                className="hidden sm:block absolute animate-spin text-red-700"
                style={{ left: '-.65rem', top: '-.15rem' }}
              />
            )}
            <span className="hidden text-xl text-gray-700 sm:block">
              {user.displayName}
            </span>
          </Link>
        </div>
        {contacts.length > 0 && (
          <Search setContacts={setContacts} contacts={contacts} />
        )}
        {user && (
          <button
            className="px-3 py-1 text-indigo-600 border-2 border-indigo-600 rounded-md shadow-md"
            onClick={signout}
          >
            Signout
          </button>
        )}
      </nav>
    </section>
  );
}
