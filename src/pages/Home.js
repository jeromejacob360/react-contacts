import { Link } from 'react-router-dom';
import Contact from '../components/Contact';
import { FaPlus } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home({
  contacts,
  contactsBackup,
  currentUser,
  loading,
  starredContact,
}) {
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
          className="p-4 m-4 border border-indigo-600 rounded-md shadow-xl transform-none"
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
                <AnimatePresence>
                  {contact.starred ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      key={contact.email}
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
