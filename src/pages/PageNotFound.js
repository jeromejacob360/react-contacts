import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="w-screen text-gray-700 h-screen flex flex-col items-center justify-center">
      <h3 className="text-3xl"> Uh oh..!! There is nothing here </h3>
      <div>
        <Link to="/">
          <button className="border px-4 py-2 rounded-md text-white bg-indigo-500 mt-10 shadow-md cursor-pointer">
            Go home
          </button>
        </Link>
      </div>
    </div>
  );
}
