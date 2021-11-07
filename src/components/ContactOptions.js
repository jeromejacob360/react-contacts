import { deleteDoc, doc } from '@firebase/firestore';
import { deleteObject, getStorage, ref } from '@firebase/storage';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { db } from '../firebase/firebase';
import ClickAway from '../helpers/ClickAway';

export default function ContactOptions({
  reverseMenu = false,
  docId,
  setOptionsOpen,
  currentUser,
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  const history = useHistory();

  function deleteContactModal(e) {
    e.stopPropagation();
    setDeleteModal(true);
  }

  async function deleteContact(e) {
    e.stopPropagation();

    setDeleteModal(false);
    await deleteDoc(
      doc(db, 'contactsApp/userContacts', currentUser?.email, docId),
    );
    const storage = getStorage();
    const avatarRef = ref(storage, `${currentUser.email}/${docId}`);
    deleteObject(avatarRef).catch((err) => {
      console.log('Error deleting the userImage from storage');
    });
    history.push('/');
  }

  if (deleteModal)
    return (
      <div className="fixed inset-0 z-10 grid w-screen h-screen bg-black place-items-center bg-opacity-10 MODAL no-print">
        <ClickAway setOption={setDeleteModal}>
          <div className="p-4 bg-white border rounded-md shadow-md w-96 MODAL">
            <div className="MODAL">Delete this contact?</div>
            <div className="flex justify-end mt-6 space-x-4 MODAL">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteModal(false);
                }}
                className="btn"
              >
                Cancel
              </button>
              <button onClick={deleteContact}>Delete</button>
            </div>
          </div>
        </ClickAway>
      </div>
    );

  return (
    <ClickAway setOption={setOptionsOpen}>
      <div
        className={`bg-gray-50 rounded-md shadow-md py-2 absolute right-5 no-print ${
          reverseMenu ? '-top-24' : 'top-10'
        } z-10`}
      >
        <ul>
          <li className="px-10" onClick={deleteContactModal}>
            <span>Delete</span>
          </li>
        </ul>
      </div>
    </ClickAway>
  );
}
