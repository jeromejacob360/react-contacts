import { doc, setDoc } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { db } from "../firebase/firebase";
import { firestoreAutoId } from "../helpers/firestoreIdGenerator";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowClose,
  faCamera,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const initialState = {
  imageURL: "",
  firstName: "",
  surname: "",
  email: "",
  phone: "",
  notes: "",
  starred: false,
};

export default function CreateContact({ currentUser }) {
  const [newContact, setNewContact] = useState(initialState);
  const [userImage, setUserImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);

  const history = useHistory();
  const { id } = useParams();
  const avatarRef = useRef();

  const { state } = useLocation();

  useEffect(() => {
    setUser(currentUser);
  }, []);

  // populate the fields
  useEffect(() => {
    if (state) setNewContact(state);
  }, [state]);

  //for updating input fields
  function setvalue(e) {
    setNewContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  //sets up preview of the chosen image
  useEffect(() => {
    if (userImage) {
      const url = URL.createObjectURL(userImage);
      avatarRef.current.style.backgroundImage = `url(${url})`;
    }
  }, [userImage]);

  //for use in edit mode. Populates the bg img from the contact
  useEffect(() => {
    if (newContact?.imageURL) {
      avatarRef.current.style.backgroundImage = `url(${newContact?.imageURL})`;
    }
  }, [newContact?.imageURL]);

  async function addContactToDB(e) {
    e.preventDefault();
    if (user)
      if (newContact.email) {
        const docId = id || firestoreAutoId();
        // add contact to firestore
        setLoading(true);
        try {
          await setDoc(doc(db, "contactsApp/userContacts", user.email, docId), {
            ...newContact,
            docId,
          });
          setLoading(false);
          setNewContact(initialState);
          history.push("/");
        } catch (error) {
          setLoading(false);
          console.log(`error`, error.message);
        }

        if (userImage) {
          //upload image to cloud storage
          try {
            const storage = getStorage();
            const storageRef = ref(storage, docId);

            const uploadTask = uploadBytesResumable(storageRef, userImage);

            uploadTask.on(
              "state_changed",
              () => {},
              (error) => {
                console.log("IMAGE UPLOAD FAILED");
                console.log(`error`, error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    await setDoc(
                      doc(
                        db,
                        "contactsApp/userContacts",
                        currentUser.email,
                        docId
                      ),
                      { imageURL: downloadURL },
                      { merge: true }
                    );
                  }
                );
              }
            );
          } catch (error) {
            console.log(`error`, error);
          }
        }
      }
  }

  return (
    <div className="flex flex-col max-w-screen-sm mx-auto space-y-2">
      <Link to="/">
        <FontAwesomeIcon icon={faWindowClose} className={`text-indigo-600`} />
      </Link>

      <form className="flex items-end justify-between">
        <label
          ref={avatarRef}
          htmlFor="image"
          className="grid w-40 h-40 bg-cover rounded-full place-items-center"
          style={{ backgroundImage: "url(no_avatar.jpg)" }}
        >
          <FontAwesomeIcon
            icon={faCamera}
            size="2x"
            className="text-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            id="image"
            className="hidden input"
            onChange={(e) => {
              setUserImage(e.target.files[0]);
            }}
          />
        </label>
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
