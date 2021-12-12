import React, { useState } from 'react';
import ClickAway from '../helpers/ClickAway';
import DeleteModal from './DeleteModal';

export default function ContactOptions({
  reverseMenu = false,
  email,
  setOptionsOpen,
  currentUser,
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  function deleteContactModal(e) {
    e.stopPropagation();
    setDeleteModal(true);
  }

  if (deleteModal)
    return (
      <DeleteModal
        email={email}
        currentUser={currentUser}
        setDeleteModal={setDeleteModal}
      />
    );

  return (
    <ClickAway setOption={setOptionsOpen}>
      <div
        className={`bg-gray-50 rounded-md shadow-md py-2 absolute right-5 no-print ${
          reverseMenu ? '-top-24' : 'top-10'
        } z-10`}
      >
        <ul>
          <li className="px-10" onClick={deleteContactModal}>
            <span>Delete</span>
          </li>
        </ul>
      </div>
    </ClickAway>
  );
}
