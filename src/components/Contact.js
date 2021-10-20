import { deleteDoc, doc } from "@firebase/firestore";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import ClickAway from "./helpers/ClickAway";

export default function Contact({ contact, setNewContact }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [reverseMenu, setReverseMenu] = useState(false);
  const history = useHistory();

  function deleteContactModal(e) {
    e.stopPropagation();
    setOptionsOpen(false);
    setOpenDeleteModal(true);
  }

  async function deleteContact(e) {
    e.stopPropagation();
    await deleteDoc(doc(db, "contacts", contact.docId));
    setOpenDeleteModal(false);
    toast.success("Deleted");
  }

  function edit(e) {
    e.stopPropagation();
    setNewContact(contact);
    history.push("/edit/" + contact.docId);
  }

  function openOptions(e) {
    e.stopPropagation();
    const elemY = Math.floor(e.target.getBoundingClientRect().y);
    window.innerHeight - elemY < 100
      ? setReverseMenu(true)
      : setReverseMenu(false);
  }

  return (
    <div
      onClick={() => history.push("/person/" + contact.email)}
      className="flex justify-between relative group py-2 px-2 hover:bg-gray-200 cursor-pointer"
    >
      <img
        className="h-10 w-10 rounded-full object-cover mr-2"
        src={contact.imageURL || "/no_avatar.jpg"}
        alt=""
      />
      <div className="items-center space-x-2 mx-4 grid grid-cols-4 flex-1">
        <h4>{`${contact.firstName} ${contact.surname}`}</h4>
        <h5>{contact.phone}</h5>
        <h5>{contact.email}</h5>
      </div>
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 flex items-center space-x-1">
        <span className="text-2xl">☆</span>
        <span onClick={edit}>✏️</span>
        <span className="relative" onClick={openOptions}>
          <svg
            onClick={() => setOptionsOpen((prev) => !prev)}
            fill={`${optionsOpen && "blue"}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </span>
      </div>
      {optionsOpen && (
        <ClickAway setOption={setOptionsOpen}>
          <div
            className={`bg-gray-50 rounded-md shadow-md py-2 absolute right-5 ${
              reverseMenu ? "-top-24" : "top-10"
            } z-10`}
          >
            <ul>
              <li>
                <span>Print</span>
              </li>
              <li>
                <span>Export</span>
              </li>
              <li onClick={deleteContactModal}>
                <span>Delete</span>
              </li>
            </ul>
          </div>
        </ClickAway>
      )}
      {openDeleteModal && (
        <div className="fixed h-screen w-screen inset-0 grid place-items-center bg-black bg-opacity-10 z-10">
          <ClickAway setOption={setOpenDeleteModal}>
            <div className="p-4 border shadow-md rounded-md bg-white w-96">
              <div>Delete this contact?</div>
              <div className="space-x-4 mt-6 flex justify-end">
                <button className="btn">Cancel</button>
                <button onClick={deleteContact}>Delete</button>
              </div>
            </div>
          </ClickAway>
        </div>
      )}
    </div>
  );
}
