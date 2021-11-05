import { doc, setDoc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { db } from '../firebase/firebase';
import { firestoreAutoId } from '../helpers/firestoreIdGenerator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { deleteImage, uploadImage } from '../helpers/uploadImage';
import ImageSetter from './ImageSetter';

const initialState = {
  imageURL: '',
  firstName: '',
  surname: '',
  email: '',
  phone: '',
  notes: '',
  starred: false,
};

export default function CreateContact({ currentUser }) {
  const [newContact, setNewContact] = useState(initialState);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { id } = useParams();

  const { state: existingContact } = useLocation();

  // populate the fields
  useEffect(() => {
    if (existingContact) setNewContact(existingContact);
  }, [existingContact]);

  //for updating input fields
  function setvalue(e) {
    setNewContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  //sets up preview of the chosen image
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setNewContact((prev) => ({ ...prev, imageURL: url }));
    }
  }, [avatarFile]);

  async function addContactToDB(e) {
    e.preventDefault();
    if (currentUser)
      if (newContact.email) {
        const docId = id || firestoreAutoId();
        // add contact to firestore
        setLoading(true);
        try {
          await setDoc(
            doc(db, 'contactsApp/userContacts', currentUser.email, docId),
            {
              ...newContact,
              docId,
            },
          );
          setLoading(false);

          setNewContact(initialState);
          history.push('/');
        } catch (error) {
          setLoading(false);
          console.log(`error`, error.message);
        }

        const storageLocation = currentUser.email + '/' + docId;
        const dbLocation = `contactsApp/userContacts/${currentUser.email}/${docId}`;

        if (avatarFile) {
          uploadImage(avatarFile, storageLocation, dbLocation);
        } else {
          deleteImage(storageLocation, dbLocation);
        }
      }
  }

  return (
    <div className="flex flex-col max-w-screen-sm mx-auto space-y-2">
      <Link to="/">
        <FontAwesomeIcon icon={faWindowClose} className={`text-indigo-600`} />
      </Link>

      <form className="flex items-end justify-between">
        <ImageSetter
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          defaultImage={newContact.imageURL}
        />
        <button className="btn" type="submit" onClick={addContactToDB}>
          SAVE
          {loading && (
            <FontAwesomeIcon
              icon={faSpinner}
              pulse
              className="ml-2 text-white"
            />
          )}
        </button>
      </form>
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="First Name"
        name="firstName"
        value={newContact?.firstName}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Surname"
        name="surname"
        value={newContact?.surname}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Email"
        name="email"
        value={newContact?.email}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Phone"
        name="phone"
        value={newContact?.phone}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Notes"
        name="notes"
        value={newContact?.notes}
        onChange={setvalue}
      />
    </div>
  );
}
