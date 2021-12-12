import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

export default function Signin({ setLoading }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false);
  const history = useHistory();

  async function signinUser(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      await signInWithEmailAndPassword(getAuth(), user.email, user.password);
      console.log('SIGNED IN');
      history.push('/');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <main className="max-w-screen-sm px-2 mx-auto mt-20">
      <div className="px-6 pb-6 border-2 border-indigo-600 rounded-md">
        <h1 className="px-1 my-6 text-4xl text-indigo-600">Sign in</h1>
        <form action="" className="flex flex-col space-y-4">
          <input
            className={`input ${error ? 'border-red-600' : ''}`}
            type="email"
            value={user.email}
            placeholder="Email"
            name="email"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
          <input
            className={`input ${error ? 'border-red-600' : ''}`}
            type="password"
            value={user.password}
            placeholder="Password"
            name="password"
            onChange={(e) =>
              setUser({ ...user, [e.target.name]: e.target.value })
            }
          />
          <div className="flex w-full space-x-4">
            <button onClick={signinUser} type="submit" className="flex-1 btn">
              Signin
            </button>
          </div>
          <Link to="/signup">
            <div className="text-center text-indigo-600 underline cursor-pointer">
              Create account
            </div>
          </Link>
        </form>
      </div>
    </main>
  );
}
