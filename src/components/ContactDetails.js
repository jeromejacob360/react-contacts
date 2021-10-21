import { doc, getDoc, onSnapshot, setDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faStar,
  faEllipsisV,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ContactOptions from "./ContactOptions";

export default function ContactDetails() {
  const [contact, setContact] = useState({});
  const [openOptions, setOpenOptions] = useState(false);

  const { email } = useParams();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "contacts", email), (doc) => {
      setContact(doc.data());
    });
    return unsub;
  }, [email]);

  async function starContact(e) {
    await setDoc(
      doc(db, "contacts", contact.docId),
      {
        starred: !contact.starred,
      },
      { merge: true }
    );
  }

  function toggleOptions() {
    setOpenOptions(true);
  }

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <section className="border-b mb-4 flex justify-between px-10 pb-6">
        <div className="flex space-x-10 items-center my-10">
          <img
            className="h-48 w-48 rounded-full object-cover mr-2"
            src={contact?.imageURL || "/no_avatar.jpg"}
            alt=""
          />
          <h4 className="text-xl">{`${contact?.firstName} ${contact?.surname}`}</h4>
        </div>
        <div className="self-end space-x-4 flex items-center">
          <FontAwesomeIcon
            icon={faStar}
            onClick={starContact}
            className={`${
              contact?.starred ? "text-yellow-400" : "text-gray-400"
            }`}
          />

          <div className="relative">
            <FontAwesomeIcon onClick={toggleOptions} icon={faEllipsisV} />
            {openOptions && (
              <ContactOptions
                setOptionsOpen={setOpenOptions}
                docId={contact?.docId}
              />
            )}
          </div>
          <Link to={"/edit/" + contact?.docId}>
            <button className="border-2 border-blue-500 rounded-md px-3 shadow-blue">
              Edit
            </button>
          </Link>
        </div>
      </section>
      <div className="border rounded-md space-x-4 p-4 block w-96 ml-auto">
        <address>
          <h5 className="font-bold mb-4">Contact details</h5>
          <div className="space-x-4">
            <FontAwesomeIcon icon={faEnvelope} />

            <span>{contact?.email}</span>
          </div>
          <div className="space-x-4">
            <FontAwesomeIcon icon={faPhone} />
            <span>{contact?.phone}</span>
          </div>
        </address>
      </div>
    </div>
  );
}
