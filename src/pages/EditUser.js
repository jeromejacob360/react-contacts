import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ImageSetter from '../components/ImageSetter';
import { db } from '../firebase/firebase';
import { uploadImage } from '../helpers/uploadImage';

export default function EditUser() {
  const [user, setUser] = useState(false);
  const [userData, setUserData] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState(userData.firstName);
  const [surName, setSurName] = useState(userData.surName);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const history = useHistory();

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
        setUserData(doc.data());
        setUserAvatar(doc.data().imageURL);
        setFirstName(doc.data().firstName);
        setSurName(doc.data().surName);
      }
    });
  }, [user]);

  useEffect(() => {
    getUserAvatar();
  }, [getUserAvatar]);

  async function updateUser(e) {
    e.preventDefault();
    setError('');
    if (!firstName) {
      setError('First name is required');
      return;
    }

    const dbLocation = `contactsApp/userDetails/placeHolder/${user.email}`;

    if (userAvatar && avatarChanged) {
      uploadImage(userAvatar, `userDPs/${user.email}`, dbLocation);
    }

    if (!userAvatar && avatarChanged) {
      await setDoc(doc(db, dbLocation), { imageURL: '' }, { merge: true });
    }

    try {
      const newContact = {
        firstName: firstName,
        surName: surName,
      };

      await setDoc(
        doc(db, 'contactsApp/userDetails/placeHolder', user.email),
        newContact,
        { merge: true },
      );
      history.push('/');
    } catch (error) {
      console.log(`error.message`, error.message);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-screen-sm px-2 mx-auto mt-28"
    >
      <Link to="/">
        <AiOutlineCloseCircle
          size={30}
          className={`bg-white text-indigo-600 absolute -top-3 -left-1`}
        />
      </Link>
      <div className="px-6 pb-6 border rounded-md shadow-none">
        <form action="" className="relative flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-1 space-y-4">
              <h1 className="px-1 my-4 text-4xl text-indigo-600">
                Edit profile
              </h1>
              <div className="block sm:hidden">
                <ImageSetter
                  setAvatarChanged={setAvatarChanged}
                  avatarFile={userAvatar}
                  setAvatarFile={setUserAvatar}
                />
              </div>
              <input
                className="input"
                type="text"
                autoComplete="off"
                value={firstName}
                placeholder="First name"
                name="firstName"
                onChange={(e) => {
                  setError('');
                  setFirstName(e.target.value);
                }}
              />
              <input
                className="input"
                type="text"
                autoComplete="off"
                value={surName}
                placeholder="Last name"
                name="surName"
                onChange={(e) => {
                  setError('');
                  setSurName(e.target.value);
                }}
              />
            </div>
            <div className="hidden sm:block">
              <ImageSetter
                avatarFile={userAvatar}
                setAvatarFile={setUserAvatar}
              />
            </div>
          </div>
          <div className="text-gray-400 cursor-not-allowed select-none input">
            {user.email}
          </div>

          <div className="flex w-full space-x-4">
            <button onClick={updateUser} type="submit" className="flex-1 btn">
              Update account
            </button>
          </div>

          {error && (
            <p className="absolute left-0 right-0 text-center text-red-600 -bottom-5">
              {error}
            </p>
          )}
        </form>
      </div>
    </motion.main>
  );
}
