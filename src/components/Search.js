import React, { useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';

export default function Search({ contacts, setContacts }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    setContacts(
      contacts?.filter((contact) => {
        const fn = contact.firstName;
        const ln = contact.surname;
        const fullName = fn ? (ln ? `${fn}${ln}` : fn) : '';
        return fullName.toLowerCase().includes(query.toLowerCase());
      }),
    );
  }, [contacts, query, setContacts]);

  return (
    <div>
      <label className="flex items-center justify-between px-2 py-1 space-x-4 border border-blue-500 rounded-md shadow-sm">
        <FaSearch />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none w-20"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        {
          <AiOutlineCloseCircle
            className={`duration-200 ${
              query ? 'opacity-100' : 'opacity-0 cursor-text'
            }`}
            onClick={() => setQuery('')}
          />
        }
      </label>
    </div>
  );
}
