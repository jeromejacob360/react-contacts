import { useHistory } from 'react-router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { setDoc, doc } from '@firebase/firestore';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import ImageSetter from '../components/ImageSetter';
import { uploadImage } from '../helpers/uploadImage';

const initialState = {
  firstName: '',
  surName: '',
  email: '',
  password: '',
  avatar: '',
};

export default function Signup() {
  const [user, setUser] = useState(initialState);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');

  const history = useHistory();

  async function createUser(e) {
    e.preventDefault();
    setError('');
    const { email, password, firstName } = user;
    if (!email || !password || !firstName) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const auth = getAuth();
    const dbLocation = `contactsApp/userDetails/placeHolder/${user.email}`;

    if (avatarFile) {
      uploadImage(avatarFile, `userDPs/${user.email}`, dbLocation);
    }

    try {
      const newContact = {
        firstName: user.firstName,
        surName: user.surName,
        email: user.email,
      };
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      await setDoc(
        doc(db, 'contactsApp/userDetails/placeHolder', user.email),
        newContact,
      );
      // setUser(initialState);

      setTimeout(async () => {
        await updateProfile(getAuth().currentUser, {
          displayName: `${user?.firstName} ${user?.surName}`,
        });
        history.push('/');
      }, 0);
    } catch (error) {
      console.log(`error.message`, error.message);
    }
  }

  return (
    <main className="max-w-screen-sm px-2 mx-auto mt-20">
      <div className="px-6 pb-6 border-2 border-indigo-600 rounded-md">
        <form action="" className="flex flex-col space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-1 space-y-4">
              <h1 className="px-1 my-4 text-4xl text-indigo-600">Sign up</h1>
              <div className="block sm:hidden">
                <ImageSetter
                  avatarFile={avatarFile}
                  setAvatarFile={setAvatarFile}
                />
              </div>
              <input
                className="input"
                type="text"
                autoComplete="off"
                value={user.firstName}
                placeholder="First name"
                name="firstName"
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
              <input
                className="input"
                type="text"
                autoComplete="off"
                value={user.surName}
                placeholder="Last name"
                name="surName"
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
            </div>
            <div className="sm:block hidden">
              <ImageSetter
                avatarFile={avatarFile}
                setAvatarFile={setAvatarFile}
              />
            </div>
          </div>
          <input
            className="input"
            type="email"
            autoComplete="off"
            value={user.email}
            placeholder="Email"
            name="email"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
          <input
            className="input"
            type="password"
            value={user.password}
            placeholder="Password (min 6 characters)"
            name="password"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
          <div className="flex w-full space-x-4">
            <button onClick={createUser} type="submit" className="flex-1 btn">
              Create account
            </button>
          </div>
          <Link to="/signin">
            <div className="text-center text-indigo-600 mb-2 underline cursor-pointer">
              Sign in
            </div>
          </Link>
          {error && (
            <p className="text-red-600 absolute -bottom-5 left-0 right-0 text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
