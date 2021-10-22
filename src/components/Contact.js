import { doc, setDoc } from "@firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/firebase";
import ContactOptions from "./ContactOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faStar } from "@fortawesome/free-solid-svg-icons";

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
    history.push("/person/edit/" + contact.docId);
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
        history.push("/person/" + contact.docId);
      }}
      className="relative flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:shadow-sm group"
    >
      <img
        className="hidden object-cover w-10 h-10 mr-2 rounded-full sm:block"
        src={contact.imageURL || "/no_avatar.jpg"}
        alt=""
      />
      <div className="grid items-center flex-1 grid-cols-2 mx-4 space-x-2 sm:grid-cols-3 md:grid-cols-4">
        <h4>{`${contact.firstName} ${contact.surname}`}</h4>
        <h5>{contact.phone}</h5>
        <h5 className="hidden sm:block">{contact.email}</h5>
        <h5 className="hidden md:block">{contact.notes}</h5>
      </div>
      <div className="absolute flex items-center pl-2 space-x-4 opacity-0 right-4 bg-indigo-50 group-hover:opacity-100">
        <span onClick={(e) => starContact(e, contact)}>
          <FontAwesomeIcon
            icon={faStar}
            className={`${
              contact.starred ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        </span>

        <span onClick={edit}>✏️</span>
        <span onClick={menuReverser}>
          <FontAwesomeIcon
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
