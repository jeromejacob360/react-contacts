import { deleteDoc, doc } from "@firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/firebase";
import ClickAway from "./helpers/ClickAway";

export default function ContactOptions({
  reverseMenu = false,
  docId,
  setOptionsOpen,
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
    await deleteDoc(doc(db, "contacts", docId));
    history.push("/");
  }

  if (deleteModal)
    return (
      <div className="fixed h-screen w-screen inset-0 grid place-items-center bg-black bg-opacity-10 z-10 MODAL">
        <ClickAway setOption={setDeleteModal}>
          <div className="p-4 border shadow-md rounded-md bg-white w-96 MODAL">
            <div className="MODAL">Delete this contact?</div>
            <div className="space-x-4 mt-6 flex justify-end MODAL">
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
        className={`bg-gray-50 rounded-md shadow-md py-2 absolute right-5 ${
          reverseMenu ? "-top-24" : "top-10"
        } z-10`}
      >
        <ul>
          <li className="px-10">
            <span>Print</span>
          </li>
          <li className="px-10">
            <span>Export</span>
          </li>
          <li className="px-10" onClick={deleteContactModal}>
            <span>Delete</span>
          </li>
        </ul>
      </div>
    </ClickAway>
  );
}
