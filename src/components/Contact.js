import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/firebase";
import ContactOptions from "./ContactOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faStar } from "@fortawesome/free-solid-svg-icons";
import ClickAway from "./helpers/ClickAway";

export default function Contact({ contact, setNewContact }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [reverseMenu, setReverseMenu] = useState(false);

  const history = useHistory();

  async function starContact(e) {
    e.stopPropagation();
    await setDoc(
      doc(db, "contacts", contact.docId),
      { starred: !contact.starred },
      { merge: true }
    );
  }

  function edit(e) {
    e.stopPropagation();
    setNewContact(contact);
    history.push("/edit/" + contact.docId);
  }

  function menuReverser(e) {
    e.stopPropagation();
    const elemY = Math.floor(e.target.getBoundingClientRect().y);
    window.innerHeight - elemY < 100
      ? setReverseMenu(true)
      : setReverseMenu(false);
  }

  return (
    <div
      onClick={(e) => {
        if (!e.target.classList.contains("MODAL"))
          history.push("/person/" + contact.docId);
      }}
      className="flex justify-between items-center relative group py-2 px-2 hover:bg-gray-200 cursor-pointer"
    >
      <img
        className="h-10 w-10 rounded-full object-cover mr-2"
        src={contact.imageURL || "/no_avatar.jpg"}
        alt=""
      />
      <div className="items-center space-x-2 mx-4 grid grid-cols-4 flex-1">
        <h4>{`${contact.firstName} ${contact.surname}`}</h4>
        <h5>{contact.phone}</h5>
        <h5>{contact.email}</h5>
      </div>
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 flex items-center">
        <span className="px-2" onClick={(e) => starContact(e, contact)}>
          <FontAwesomeIcon
            icon={faStar}
            className={`${
              contact.starred ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        </span>

        <span className="px-2" onClick={edit}>
          ✏️
        </span>
        <span onClick={menuReverser}>
          <FontAwesomeIcon
            size="4x"
            className={`px-2`}
            onClick={() => setOptionsOpen((prev) => !prev)}
            icon={faEllipsisV}
          />
        </span>
      </div>
      {optionsOpen && (
        <ContactOptions
          reverseMenu={reverseMenu}
          docId={contact.docId}
          setOptionsOpen={setOptionsOpen}
        />
      )}
    </div>
  );
}
