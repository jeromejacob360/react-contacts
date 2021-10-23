import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";

export default function Search({ contacts, setContacts }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setContacts(
      contacts?.filter((contact) => {
        const fn = contact.firstName;
        const ln = contact.surname;
        const fullName = fn ? (ln ? `${fn}${ln}` : fn) : "";
        return fullName.toLowerCase().includes(query.toLowerCase());
      })
    );
  }, [contacts, query, setContacts]);

  return (
    <div>
      <label className="flex items-center justify-between px-2 py-1 space-x-4 border border-blue-500 rounded-md shadow-sm">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        {
          <FontAwesomeIcon
            className={`duration-200 ${
              query ? "opacity-100" : "opacity-0 cursor-text"
            }`}
            icon={faWindowClose}
            onClick={() => setQuery("")}
          />
        }
      </label>
    </div>
  );
}
