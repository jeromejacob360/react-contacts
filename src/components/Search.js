import React, { useRef } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';

export default function Search({ contacts, setContacts }) {
  const ref = useRef();

  const search = (key) => {
    setContacts(
      contacts?.filter((contact) => {
        const fn = contact.firstName;
        const ln = contact.surname;
        const fullName = fn ? (ln ? `${fn}${ln}` : fn) : '';
        return fullName.toLowerCase().includes(key.toLowerCase());
      }),
    );
  };

  return (
    <div>
      <label className="flex items-center justify-between px-2 py-1 space-x-4 border border-blue-500 rounded-md shadow-sm">
        <FaSearch />
        <input
          ref={ref}
          type="text"
          placeholder="Search"
          className="flex-1 w-16 bg-transparent outline-none sm:w-40 md:w-52 lg:w-96"
          onChange={(e) => search(e.target.value)}
        />
        {
          <AiOutlineCloseCircle
            className={` ${
              ref.current && ref.current.value
                ? 'opacity-100'
                : 'opacity-0 cursor-text'
            }`}
            onClick={() => {
              ref.current.value = '';
              search('');
            }}
          />
        }
      </label>
    </div>
  );
}
