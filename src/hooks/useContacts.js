import { collection, onSnapshot } from '@firebase/firestore';
import { useEffect } from 'react';
import { db } from '../firebase/firebase';

export default function useContacts(
  setContactsBackup,
  setContacts,
  currentUser,
) {
  useEffect(() => {
    let unsub;
    if (currentUser && currentUser.email) {
      const contactsRef = collection(
        db,
        'contactsApp/userContacts',
        currentUser.email,
      );

      unsub = onSnapshot(contactsRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const newData = change.doc.data();

          if (change.type === 'added') {
            setContacts((prev) => [...prev, newData]);
            setContactsBackup((prev) => [...prev, newData]);
          } else if (change.type === 'modified') {
            setContactsBackup((prev) =>
              prev.map((contact) =>
                contact.docId === newData.docId ? newData : contact,
              ),
            );
            setContacts((prev) =>
              prev.map((contact) =>
                contact.docId === newData.docId ? newData : contact,
              ),
            );
          } else if (change.type === 'removed') {
            setContactsBackup((prev) => {
              return prev.filter((contact) => contact.email !== newData.email);
            });
            setContacts((prev) => {
              return prev.filter((contact) => contact.email !== newData.email);
            });
          }
        });
      });
    }
    return unsub;
  }, [currentUser, setContacts, setContactsBackup]);
}
