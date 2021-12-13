import React from 'react';
import { Link } from 'react-router-dom';
import Contact from '../components/Contact';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home({
  contacts,
  contactsBackup,
  currentUser,
  loading,
}) {
  if (loading) {
    return null;
  }

  // const sorter = (a, b) => {
  //   const nameA = (a.firstName + a.surname).toUpperCase();
  //   const nameB = (b.firstName + b.surname).toUpperCase();
  //   if (a.starred && b.starred) {
  //     return nameA.localeCompare(nameB);
  //   }
  //   if (!a.starred && !b.starred) {
  //     return nameA.localeCompare(nameB);
  //   }
  //   if (a.starred && !b.starred) return -1;
  //   if (!a.starred && b.starred) return 1;
  //   return 0;
  // };

  return (
    <div className="max-w-screen-xl mx-auto mt-28">
      {!loading && contactsBackup.length === 0 ? (
        <div className="text-xl text-center text-indigo-500">
          You don't have any contacts yet..!
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ easin: 'linear' }}
          layout
          className="p-4 m-4 space-y-4 border border-indigo-600 rounded-md shadow-xl"
        >
          <div className="flex justify-between pl-2 border-b border-blue-500 sm:pl-12">
            <motion.div
              layout="false"
              className="grid items-center flex-1 grid-cols-2 pb-4 mx-5 space-x-2 font-semibold sm:grid-cols-3 md:grid-cols-4"
            >
              <h4>Name</h4>
              <h5>Phone</h5>
              <h5 className="hidden sm:block">Email</h5>
              <h5 className="hidden md:block">Notes</h5>
            </motion.div>
          </div>
          {contacts
            ?.sort((a, b) => {
              return (a.firstName + a.surname)
                .toUpperCase()
                .localeCompare((b.firstName + b.surname).toUpperCase());
            })
            .map((contact) => (
              <Contact
                currentUser={currentUser}
                contact={contact}
                key={contact.email}
              />
            ))}
        </motion.div>
      )}
      <div className="fixed left-0 flex justify-end max-w-screen-xl mx-auto bottom-4 right-4">
        <Link
          to="/new"
          className="text-white bg-indigo-600 rounded-full shadow-md"
        >
          <FaPlus size={50} className="p-2 text-white" />
        </Link>
      </div>
    </div>
  );
}
