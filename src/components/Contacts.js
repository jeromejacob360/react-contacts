import { collection, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import Contact from "./Contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Contacts({ setNewContact, setLockEmail }) {
  const [contacts, setContacts] = useState([]);

  async function getContactsFromDB() {
    const contactsRef = collection(db, "contacts");
    onSnapshot(contactsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setContacts((prev) => [...prev, change.doc.data()]);
        } else if (change.type === "removed") {
          setContacts((prev) => {
            return prev.filter(
              (contact) => contact.email !== change.doc.data().email
            );
          });
        }
      });
    });
  }

  useEffect(() => {
    getContactsFromDB();
  }, []);

  return (
    <div className="space-y-4 max-w-screen-lg mx-auto">
      <div className="flex justify-between ml-12 border-b mt-4">
        <div className="items-center space-x-2 mx-4 grid grid-cols-4 flex-1">
          <h4>Name</h4>
          <h5>Phone</h5>
          <h5>Email</h5>
        </div>
      </div>
      {contacts.map((contact) => (
        <Contact
          setNewContact={setNewContact}
          setLockEmail={setLockEmail}
          contact={contact}
          key={contact.email}
        />
      ))}
      <Link
        to="/new"
        className="bg-blue-500 rounded-full h-20 grid place-items-center w-20  text-white shadow-md fixed bottom-10 right-10"
      >
        <FontAwesomeIcon icon={faPlus} size="3x" className="text-white" />
      </Link>
    </div>
  );
}
