import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { db } from '../firebase/firebase';
import ClickAway from '../helpers/ClickAway';
import {
  deleteObject,
  getStorage,
  ref,
  getDownloadURL,
} from '@firebase/storage';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { motion } from 'framer-motion';

export default function DeleteModal({ setDeleteModal, currentUser, email }) {
  const history = useHistory();

  async function deleteContact(e) {
    e.stopPropagation();

    setDeleteModal(false);
    history.push('/');
    await deleteDoc(
      doc(db, 'contactsApp/userContacts', `${currentUser.email}/${email}`),
    );
    const storage = getStorage();
    const avatarRef = ref(storage, `${currentUser.email}/${email}`);
    getDownloadURL(avatarRef).then(async (url) => {
      if (url) {
        await deleteObject(avatarRef);
      }
    });
  }

  useEffect(() => {
    const element = document.getElementById('home');
    if (element) element.style.transform = 'none';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ easin: 'linear' }}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full p-4 bg-black bg-opacity-20"
    >
      <ClickAway setOption={setDeleteModal}>
        <div className="p-4 bg-white border rounded-md shadow-none w-96 MODAL">
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
    </motion.div>
  );
}
