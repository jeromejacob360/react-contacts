import { getAuth } from '@firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import logo from '../images/logo.png';
import { ImSpinner8 } from 'react-icons/im';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Navbar({ setContacts, contacts, loading }) {
  const [user, setUser] = useState(false);
  const [userAvatar, setUserAvatar] = useState(logo);

  const location = useLocation();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else setUser(false);
    });
  }, []);

  const getUserAvatar = useCallback(async () => {
    if (!user) return;
    await getDoc(
      doc(db, `contactsApp/userDetails/placeHolder/${user.email}`),
    ).then(async (doc) => {
      if (doc.data()) {
        setUserAvatar(doc.data().imageURL);
      } else {
        setUserAvatar(logo);
      }
    });
  }, [user]);

  useEffect(() => {
    getUserAvatar();
  }, [getUserAvatar]);

  async function signout() {
    await getAuth().signOut();
  }
  return (
    <section className="fixed top-0 w-screen h-20 bg-white shadow-md">
      <nav className="flex items-center justify-between w-full h-20 max-w-screen-lg px-4 mx-auto space-x-2">
        <div className="items-center hidden space-x-4 sm:flex">
          <Link to="/" className="relative flex items-center space-x-2">
            <img
              src={userAvatar} //TODO add user DP here
              className="object-cover w-16 h-16 rounded-full"
              alt=""
            />
            {loading && (
              <ImSpinner8
                size={75}
                className="absolute hidden text-indigo-800 sm:block animate-spin"
                style={{ left: '-.75rem', top: '-.3rem' }}
              />
            )}
            <span className="hidden text-xl text-gray-700 sm:block">
              {user.displayName}
            </span>
          </Link>
        </div>
        {contacts.length > 0 && location.pathname === '/' && (
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
