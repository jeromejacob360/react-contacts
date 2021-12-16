import { getAuth } from '@firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import logo from '../images/logo.png';
import noAvatar from '../images/no_avatar.jpg';
import { ImSpinner8 } from 'react-icons/im';
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { RiEditBoxLine } from 'react-icons/ri';

export default function Navbar({
  setContacts,
  contacts,
  loading,
  currentUser,
}) {
  const [user, setUser] = useState('');
  const [userAvatar, setUserAvatar] = useState(logo);

  const location = useLocation();

  const getUserAvatar = useCallback(async () => {
    if (!currentUser) return;
    onSnapshot(
      doc(db, `contactsApp/userDetails/placeHolder/${currentUser.email}`),
      (doc) => {
        if (doc.data()) {
          setUser(doc.data());
          setUserAvatar(doc.data().imageURL);
        } else {
          setUserAvatar(logo);
        }
      },
    );
  }, [currentUser]);

  useEffect(() => {
    getUserAvatar();
  }, [getUserAvatar]);

  async function signout() {
    await getAuth().signOut();
  }
  return (
    <section className="fixed top-0 w-screen h-20 bg-white shadow-md">
      <nav className="flex items-center justify-between w-full h-20 max-w-screen-lg px-4 mx-auto space-x-2 sm:px-10 md:px-20">
        <div className="items-center space-x-4">
          <div className="relative flex items-center space-x-2 group">
            <Link to="/">
              <img
                src={userAvatar || noAvatar}
                className="object-cover w-16 h-16 rounded-full"
                alt=""
              />
            </Link>
            {loading && (
              <ImSpinner8
                size={75}
                className="absolute hidden text-gray-300 sm:block animate-spin"
                style={{ left: '-.75rem', top: '-.3rem' }}
              />
            )}
            <Link to={`/user/edit`}>
              <RiEditBoxLine
                size={30}
                className="absolute hidden px-1 text-gray-500 bg-white border -bottom-5 left-9 group-hover:block rounded-xl"
              />
            </Link>
            <span className="hidden text-xl text-gray-700 cursor-default sm:block">
              {user.firstName && user.firstName + ' ' + user.surName}
            </span>
          </div>
        </div>
        {contacts.length > 0 && location.pathname === '/' && (
          <Search setContacts={setContacts} contacts={contacts} />
        )}
        {user && (
          <button
            className="px-3 py-1 text-indigo-600 border-2 border-indigo-600 rounded-md shadow-none"
            onClick={signout}
          >
            Signout
          </button>
        )}
      </nav>
    </section>
  );
}
