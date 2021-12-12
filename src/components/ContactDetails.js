import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../firebase/firebase';
import { AiOutlinePhone, AiFillStar, AiOutlineLeft } from 'react-icons/ai';
import { BiEnvelope } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import no_avatar from '../images/no_avatar.jpg';
import { AiFillDelete } from 'react-icons/ai';
import DeleteModal from './DeleteModal';

export default function ContactDetails({ currentUser }) {
  const [contact, setContact] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

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

  return (
    <div className="max-w-screen-md px-4 mt-28 mx-auto">
      <Link to="/">
        <AiOutlineLeft
          size={40}
          className="border rounded-full p-1 shadow-md"
        />
      </Link>
      <section className="flex-col flex sm:px-20 justify-center sm:justify-around sm:flex-row items-center px-10 pb-6 mb-4 border-b">
        <div className="sm:flex flex-col items-center my-10 ">
          <img
            className="object-cover mx-auto w-48 h-48 mr-2 rounded-full"
            src={contact?.imageURL || no_avatar}
            alt=""
          />
          <h4 className="text-xl text-center mt-4">{`${contact?.firstName} ${contact?.surname}`}</h4>
        </div>
        <div className="flex items-center justify-end">
          <AiFillStar
            size={25}
            onClick={starContact}
            className={`${
              contact?.starred ? 'text-yellow-400' : 'text-gray-400'
            }`}
          />

          <div className="relative px-4">
            <AiFillDelete size={25} onClick={() => setDeleteModal(true)} />
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
          <div className="space-x-4 flex items-center mb-4">
            <BiEnvelope />
            <span>{contact?.email}</span>
          </div>
          <div className="space-x-4 flex items-center ">
            <AiOutlinePhone />
            <span>{contact?.phone}</span>
          </div>
        </address>
      </div>
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          currentUser={currentUser}
          email={contact.email}
        />
      )}
    </div>
  );
}
