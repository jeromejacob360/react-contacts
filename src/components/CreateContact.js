import { doc, setDoc } from "@firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { firestoreAutoId } from "./helpers/firestoreIdGenerator";
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

export default function CreateContact({
  newContact,
  setNewContact,
  initialState,
  lockEmail,
}) {
  const [userImage, setUserImage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const avatarRef = useRef();

  let url = "";

  function setvalue(e) {
    setNewContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    if (userImage) {
      const url = URL.createObjectURL(userImage);
      avatarRef.current.style.backgroundImage = `url(${url})`;
    }
  }, [newContact.imageURL, userImage]);

  useEffect(() => {
    if (newContact.imageURL) {
      avatarRef.current.style.backgroundImage = `url(${newContact.imageURL})`;
    }
  }, [newContact.imageURL]);

  async function addContactToDB(e) {
    e.preventDefault();

    if (newContact.email) {
      if (userImage) {
        const promise = new Promise((res, rej) => {
          const storage = getStorage();
          const storageRef = ref(storage, newContact.email);

          const uploadTask = uploadBytesResumable(storageRef, userImage);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.log(`error`, error);
              rej(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                res(downloadURL);
              });
            }
          );
        });

        setLoading(true);
        url = await promise;

        setLoading(false);
      }

      setLoading(true);
      try {
        const docId = id || firestoreAutoId();
        await setDoc(doc(db, "contacts", docId), {
          ...newContact,
          imageURL: url,
          docId,
        });

        setNewContact(initialState);
        toast.success("Done!");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(`error`, error.message);
      }

      history.push("/");
    }
  }

  return (
    <div className="flex flex-col space-y-2 max-w-screen-sm mx-auto">
      <Link to="/">
        <FontAwesomeIcon icon={faWindowClose} className={`text-gray-500`} />
      </Link>

      <form className="flex justify-between items-end">
        <label
          ref={avatarRef}
          htmlFor="image"
          className="rounded-full w-40 h-40 grid place-items-center bg-cover"
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
              className="text-white ml-2"
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
        value={newContact.firstName}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Surname"
        name="surname"
        value={newContact.surname}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Email"
        name="email"
        value={newContact.email}
        onChange={setvalue}
        disabled={lockEmail}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Phone"
        name="phone"
        value={newContact.phone}
        onChange={setvalue}
      />
      <input
        className="input"
        autoComplete="off"
        type="text"
        placeholder="Notes"
        name="notes"
        value={newContact.notes}
        onChange={setvalue}
      />
    </div>
  );
}
