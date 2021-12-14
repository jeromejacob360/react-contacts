import { doc, setDoc, getDoc } from '@firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { db } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { deleteImage, uploadImage } from '../helpers/uploadImage';
import ImageSetter from './ImageSetter';
import { CgSpinner } from 'react-icons/cg';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

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
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const firstNameRef = useRef();

  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setEditMode(true);
    }
  }, [location]);

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
    setError('');
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

    setError('');

    if (!currentUser) return;
    const { firstName, email } = newContact;
    if (!firstName || !email) {
      setError('First name and email are required');
      return;
    }

    const docId = id || newContact.email;
    // add contact to firestore
    setLoading(true);
    try {
      if (!existingContact) newContact.imageURL = '';

      const snap = await getDoc(
        doc(db, 'contactsApp/userContacts', currentUser.email, docId),
      );
      if (snap.data()) {
        setError('Contact with same email already exists');
        setLoading(false);
        return;
      }

      await setDoc(
        doc(db, 'contactsApp/userContacts', currentUser.email, docId),
        { ...newContact, docId },
      );
      setLoading(false);

      setNewContact(initialState);
      history.push('/');
    } catch (error) {
      setLoading(false);
    }

    const storageLocation = currentUser.email + '/' + docId;
    const dbLocation = `contactsApp/userContacts/${currentUser.email}/${docId}`;

    if (avatarFile) {
      uploadImage(avatarFile, storageLocation, dbLocation);
    } else {
      deleteImage(storageLocation, dbLocation);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ easin: 'linear' }}
      className="z-20 max-w-screen-md py-8 mx-auto mt-28"
    >
      <div className="relative px-4 mx-4 border rounded-lg shadow-none sm:px-10">
        <Link to="/">
          <AiOutlineCloseCircle
            size={30}
            className={`bg-white text-indigo-600 absolute -top-3 -left-3`}
          />
        </Link>
        <form className="flex flex-col pb-10 space-y-4">
          <div className="flex flex-col items-center justify-between my-8 sm:px-20 sm:items-end sm:flex-row">
            <ImageSetter
              avatarFile={avatarFile}
              setAvatarFile={setAvatarFile}
              defaultImage={newContact.imageURL}
            />
            <button
              className="relative mt-10 btn"
              type="submit"
              onClick={addContactToDB}
            >
              <p> SAVE</p>
              {loading && (
                <CgSpinner className="absolute text-white animate-spin right-1 top-2" />
              )}
            </button>
          </div>
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

          {editMode ? (
            <div className="text-gray-500 cursor-not-allowed input">
              {newContact?.email}
            </div>
          ) : (
            <input
              className="input"
              autoComplete="off"
              type="text"
              placeholder="Email"
              name="email"
              value={newContact?.email}
              onChange={setvalue}
            />
          )}
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
          {error && <p className="text-center text-red-600">{error}</p>}
        </form>
      </div>
    </motion.div>
  );
}
