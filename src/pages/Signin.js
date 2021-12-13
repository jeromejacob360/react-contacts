import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

export default function Signin({ setLoading }) {
  const [user, setUser] = useState({
    email: '',
    password: '123123',
  });
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const history = useHistory();
  const optionsRef = useRef();

  async function signinUser(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      await signInWithEmailAndPassword(getAuth(), user.email, user.password);
      history.push('/');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ easin: 'linear' }}
      className="max-w-screen-sm px-2 mx-auto mt-28"
    >
      <div className="px-6 pb-6 border-2 border-indigo-600 rounded-md">
        <h1 className="px-1 my-6 text-4xl text-indigo-600">Sign in</h1>
        <form action="" className="flex flex-col space-y-4">
          <select
            className="input"
            ref={optionsRef}
            onChange={(e) => {
              setError(false);
              setUser({ ...user, email: e.target.value });
            }}
          >
            <option disabled selected value="">
              Select a dummy account
            </option>
            <option value="jane@gmail.com">jane@gmail.com</option>
            <option value="john@gmail.com">john@gmail.com</option>
            <option value="wayne@gmail.com">wayne@gmail.com</option>
          </select>
          <p className="text-center ">OR</p>
          <input
            className={`input ${error ? 'border-red-600' : ''}`}
            type="email"
            value={user.email}
            placeholder="Email"
            name="email"
            onChange={(e) => {
              optionsRef.current.value = '';
              setUser({ ...user, [e.target.name]: e.target.value });
            }}
          />

          <div className="relative flex items-center">
            <input
              className={`w-full input ${error ? 'border-red-600' : ''}`}
              type={showPw ? 'text' : 'password'}
              value={user.password}
              placeholder="Password"
              name="password"
              onChange={(e) => {
                setError(false);
                setUser({ ...user, [e.target.name]: e.target.value });
              }}
            />
            <AiFillEyeInvisible
              className="absolute text-indigo-500 right-4"
              onMouseDown={() => setShowPw(true)}
              onMouseUp={() => setShowPw(false)}
            />
          </div>
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
    </motion.main>
  );
}
