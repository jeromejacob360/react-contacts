import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../firebase/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faStar,
  faEllipsisV,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ContactOptions from './ContactOptions';
import no_avatar from '../images/no_avatar.jpg';

export default function ContactDetails({ currentUser }) {
  const [contact, setContact] = useState({});
  const [openOptions, setOpenOptions] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    let unsub;
    if (currentUser?.email)
      unsub = onSnapshot(
        doc(db, 'contactsApp/userContacts', currentUser?.email, id),
        (doc) => {
          setContact(doc.data());
        },
      );
    return unsub;
  }, [currentUser?.email, id]);

  async function starContact(e) {
    await setDoc(
      doc(db, 'contactsApp/userContacts', currentUser.email, contact?.docId),
      {
        starred: !contact?.starred,
      },
      { merge: true },
    );
  }

  function toggleOptions() {
    setOpenOptions(true);
  }

  return (
    <div className="max-w-screen-md px-4 mx-auto">
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>
      <section className="flex justify-between px-10 pb-6 mb-4 border-b">
        <div className="flex items-center my-10 space-x-10">
          <img
            className="object-cover w-48 h-48 mr-2 rounded-full"
            src={contact?.imageURL || no_avatar}
            alt=""
          />
          <h4 className="text-xl">{`${contact?.firstName} ${contact?.surname}`}</h4>
        </div>
        <div className="flex items-center self-end">
          <FontAwesomeIcon
            icon={faStar}
            onClick={starContact}
            className={`${
              contact?.starred ? 'text-yellow-400' : 'text-gray-400'
            }`}
          />

          <div className="relative px-4">
            <FontAwesomeIcon onClick={toggleOptions} icon={faEllipsisV} />
            {openOptions && (
              <ContactOptions
                currentUser={currentUser}
                setOptionsOpen={setOpenOptions}
                docId={contact?.docId}
              />
            )}
          </div>
          <Link
            to={{ pathname: '/person/edit/' + contact?.email, state: contact }}
          >
            <button className="px-3 border-2 border-indigo-600 rounded-md">
              Edit
            </button>
          </Link>
        </div>
      </section>
      <div className="block p-4 ml-auto space-x-4 border rounded-md w-96">
        <address>
          <h5 className="mb-4 font-bold">Contact details</h5>
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
