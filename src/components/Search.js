import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faWindowClose } from "@fortawesome/free-solid-svg-icons";

export default function Search({ contacts, setContacts }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setContacts(
      contacts.filter((contact) => {
        const fn = contact.firstName;
        const ln = contact.surname;
        const fullName = fn ? (ln ? `${fn}${ln}` : fn) : "";
        return fullName.toLowerCase().includes(query.toLowerCase());
      })
    );
  }, [contacts, query, setContacts]);

  return (
    <div>
      <label className="border shadow-sm justify-between p-2 w-96 items-center flex rounded-md space-x-4">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none flex-1"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        {query && (
          <FontAwesomeIcon onClick={() => setQuery("")} icon={faWindowClose} />
        )}
      </label>
    </div>
  );
}
