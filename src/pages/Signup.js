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

  const history = useHistory();

  async function createUser(e) {
    e.preventDefault();

    const auth = getAuth();
    const dbLocation = `contactsApp/userDetails/placeHolder/${user.email}`;

    if (avatarFile)
      uploadImage(avatarFile, `userDPs/${user.email}`, dbLocation);

    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      await setDoc(doc(db, 'contactsApp/userDetails/placeHolder', user.email), {
        firstName: user.firstName,
        surName: user.surName,
        email: user.email,
      });
      setUser(initialState);

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
        <form action="" className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-1 space-y-4">
              <h1 className="px-1 my-4 text-4xl text-indigo-600">Sign up</h1>
              <input
                className="input"
                type="text"
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
                value={user.surName}
                placeholder="Last name"
                name="surName"
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
            </div>
            <ImageSetter
              avatarFile={avatarFile}
              setAvatarFile={setAvatarFile}
            />
          </div>
          <input
            className="input"
            type="text"
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
            placeholder="Password"
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
            <div className="text-center text-indigo-600 underline cursor-pointer">
              Sign in
            </div>
          </Link>
        </form>
      </div>
    </main>
  );
}
