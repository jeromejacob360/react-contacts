import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../firebase/firebase';
import { AiOutlinePhone, AiFillStar, AiOutlineLeft } from 'react-icons/ai';
import { BiEnvelope } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import no_avatar from '../images/no_avatar.jpg';
import { MdDelete } from 'react-icons/md';
import DeleteModal from './DeleteModal';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ easin: 'linear' }}
      className="max-w-screen-md px-4 mx-auto mt-28"
    >
      <Link to="/">
        <AiOutlineLeft
          size={40}
          className="p-1 border rounded-full shadow-none"
        />
      </Link>
      <section className="flex flex-col items-center justify-center px-10 pb-6 mb-4 border-b sm:px-20 sm:justify-around sm:flex-row">
        <div className="flex-col items-center my-10 sm:flex ">
          <img
            className="object-cover w-48 h-48 mx-auto mr-2 rounded-2xl"
            src={contact?.imageURL || no_avatar}
            alt=""
          />
          <h4 className="mt-4 text-xl text-center">{`${contact?.firstName} ${contact?.surname}`}</h4>
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
            <MdDelete size={25} onClick={() => setDeleteModal(true)} />
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
          <div className="flex items-center mb-4 space-x-2">
            <a href={`mailto:${contact?.email}`}>
              <BiEnvelope />
            </a>
            <span>{contact?.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <a href={`tel:${contact?.phone} `}>
              <AiOutlinePhone />
            </a>
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
    </motion.div>
  );
}
