import { doc, setDoc } from '@firebase/firestore';
import { useHistory } from 'react-router';
import { db } from '../firebase/firebase';
import no_avatar from '../images/no_avatar.jpg';
import { AiFillStar } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import DeleteModal from './DeleteModal';

export default function Contact({ contact, currentUser }) {
  const history = useHistory();
  const [deleteModal, setDeleteModal] = useState(false);

  async function starContact(e) {
    e.stopPropagation();
    await setDoc(
      doc(db, 'contactsApp/userContacts', currentUser.email, contact.docId),
      { starred: !contact.starred },
      { merge: true },
    );
  }

  return (
    <>
      <div
        onClick={(e) => {
          history.push('/person/' + contact.docId);
        }}
        className="relative  flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:shadow-sm group"
      >
        <img
          className="hidden object-cover w-10 h-10 mr-2 rounded-full sm:block"
          src={contact.imageURL || no_avatar}
          alt=""
        />
        <div className="grid items-center flex-1 grid-cols-2 mx-4 space-x-2 sm:grid-cols-3 md:grid-cols-4">
          <h4>{`${contact.firstName} ${contact.surname}`}</h4>
          <h5>{contact.phone}</h5>
          <h5 className="hidden sm:block">{contact.email}</h5>
          <h5 className="hidden md:block">{contact.notes}</h5>
        </div>
        <div className="absolute flex items-center h-full pl-2 opacity-0 right-4 group-hover:opacity-100">
          <span
            onClick={(e) => starContact(e)}
            className="flex items-center h-full pl-8 pr-4 bg-gradient-to-r from-transparent to-indigo-50"
          >
            <AiFillStar
              size={30}
              className={`${
                contact.starred ? 'text-yellow-400' : 'text-gray-400'
              }`}
            />
          </span>
          <div className="flex items-center h-full bg-indigo-50">
            <MdDelete
              size={25}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal(true);
              }}
            />
          </div>
        </div>
      </div>
      {deleteModal && (
        <DeleteModal
          currentUser={currentUser}
          setDeleteModal={setDeleteModal}
          email={contact.email}
        />
      )}
    </>
  );
}
