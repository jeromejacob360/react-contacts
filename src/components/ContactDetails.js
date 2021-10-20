import { doc, getDoc, setDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faStar,
  faEllipsisV,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";

export default function ContactDetails() {
  const [contact, setContact] = useState({});
  const { email } = useParams();

  async function getContact() {
    const temp = (await getDoc(doc(db, "contacts", email))).data();
    setContact(temp);
  }

  async function toggleContactStar() {
    await setDoc(doc(db, "contacts", contact.email), {
      ...contact,
      starred: !contact.starred,
    });
  }

  useEffect(() => {
    getContact();
  }, []);

  return (
    <div className="max-w-screen-md mx-auto">
      {JSON.stringify(contact)}
      <section className="border-b mb-4 flex justify-between px-10 pb-6">
        <div className="flex space-x-10 items-center my-10">
          <img
            className="h-2w-48 w-48 rounded-full object-cover mr-2"
            src={contact?.imageURL || "/no_avatar.jpg"}
            alt=""
          />
          <h4 className="text-xl">{`${contact?.firstName} ${contact?.surname}`}</h4>
        </div>
        <div className="self-end space-x-6">
          <FontAwesomeIcon
            onClick={toggleContactStar}
            icon={faStar}
            className=" opacity-30"
          />
          <FontAwesomeIcon icon={faEllipsisV} />
          <button className="btn">Edit</button>
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
