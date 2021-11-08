import { doc, setDoc } from '@firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { db } from '../firebase/firebase';

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

  const firstNameRef = useRef();

  const history = useHistory();
  const { id } = useParams();

  const { state: existingContact } = useLocation();

  // populate the fields
  useEffect(() => {
    if (existingContact) {
      setNewContact(existingContact);
      setAvatarFile(existingContact.imageURL);
    }
  }, [existingContact]);

  // if it is a redirect from WA, grab the email from URL
  useEffect(() => {
    if (id) setNewContact((prev) => ({ ...prev, email: id }));
  }, [id]);

  // focus on first name
  useEffect(() => {
    firstNameRef.current.focus();
  }, []);

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
      // avatarFile is now base64 uri
      setNewContact((prev) => ({ ...prev, imageURL: avatarFile }));
    }
  }, [avatarFile]);

  async function addContactToDB(e) {
    e.preventDefault();

    if (currentUser)
      if (newContact.email) {
        const docId = id || newContact.email;
        // add contact to firestore
        setLoading(true);
        try {
          newContact.imageURL = '';

          await setDoc(
            doc(db, 'contactsApp/userContacts', currentUser.email, docId),
            { ...newContact, docId },
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
        ref={firstNameRef}
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
