import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Contact from '../components/Contact';
import { FaPlus } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { toast } from 'react-toastify';

export default function Home({
  contacts,
  contactsBackup,
  currentUser,
  loading,
  starredContact,
}) {
  useEffect(() => {
    async function getInvites() {
      const res = await getDoc(
        doc(db, 'contactsApp/invites/for/' + currentUser.email),
      );
      if (!res.exists()) return;
      const invites = Object.keys(res.data());
      toast.info(<Toast length={invites.length} email={currentUser.email} />);
    }
    getInvites();
  }, [currentUser.email]);

  if (loading) {
    return null;
  }

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
          id="home"
          className="p-4 m-4 border rounded-lg"
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
          {starredContact && (
            <h2 className="px-10 pb-3 mt-2 text-xs font-semibold text-gray-600 uppercase border-b">
              Starred contacts
            </h2>
          )}
          {contacts
            ?.sort((a, b) => {
              return (a.firstName + a.surname)
                .toUpperCase()
                .localeCompare((b.firstName + b.surname).toUpperCase());
            })
            .map((contact) => {
              return (
                <AnimatePresence key={contact.email}>
                  {contact.starred ? (
                    <motion.div
                      className="odd:bg-gray-50"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <Contact
                        currentUser={currentUser}
                        contact={contact}
                        key={contact.email}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              );
            })}
          {starredContact && (
            <h2 className="px-10 py-2 text-xs font-semibold text-gray-600 uppercase border-t border-b">
              Contacts
            </h2>
          )}
          {contacts
            ?.sort((a, b) => {
              return (a.firstName + a.surname)
                .toUpperCase()
                .localeCompare((b.firstName + b.surname).toUpperCase());
            })
            .map((contact) => (
              <motion.div
                className="odd:bg-gray-50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                key={contact.email}
              >
                <Contact currentUser={currentUser} contact={contact} />
              </motion.div>
            ))}
        </motion.div>
      )}
      <div className="fixed left-0 flex justify-end max-w-screen-xl mx-auto bottom-4 right-4">
        <Link
          to="/new"
          className="text-white bg-indigo-600 rounded-full shadow-none"
        >
          <FaPlus size={50} className="p-2 text-white" />
        </Link>
      </div>
    </div>
  );
}

function Toast({ length, email }) {
  const message = `You have ${length} invite${
    length > 1 ? 's' : ''
  } to join Whoosapp`;

  async function ignoreInvite() {
    await deleteDoc(doc(db, 'contactsApp/invites/for/' + email));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div> {message}</div>
      <div className="flex mt-2 space-x-2">
        <button className="px-4 ml-4 text-white bg-indigo-500 border rounded-md shadow-sm ">
          <a
            href="https://react-whoosapp.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            Join
          </a>
        </button>
        <button
          onClick={ignoreInvite}
          className="px-4 ml-4 text-white bg-red-500 border rounded-md shadow-sm "
        >
          Ignore
        </button>
      </div>
    </div>
  );
}
