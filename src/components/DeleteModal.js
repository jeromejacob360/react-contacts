import { deleteDoc, doc } from 'firebase/firestore';
import React from 'react';
import { db } from '../firebase/firebase';
import ClickAway from '../helpers/ClickAway';
import {
  deleteObject,
  getStorage,
  ref,
  getDownloadURL,
} from '@firebase/storage';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function DeleteModal({ setDeleteModal, currentUser, email }) {
  console.log('DeleteModal');
  const history = useHistory();

  async function deleteContact(e) {
    e.stopPropagation();

    setDeleteModal(false);
    await deleteDoc(
      doc(db, 'contactsApp/userContacts', `${currentUser.email}/${email}`),
    );
    console.log('Deleted');
    const storage = getStorage();
    const avatarRef = ref(storage, `${currentUser.email}/${email}`);
    getDownloadURL(avatarRef).then(async (url) => {
      if (url) {
        await deleteObject(avatarRef);
      }
    });
    history.push('/');
  }

  return (
    <div className="fixed inset-0 z-10 flex justify-center items-center w-screen h-screen bg-black bg-opacity-10 MODAL no-print">
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
}
