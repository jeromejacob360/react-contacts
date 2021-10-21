import CreateContact from "./components/CreateContact";
import Contacts from "./components/Contacts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import ContactDetails from "./components/ContactDetails";
import useContacts from "./components/hooks/useContacts";

const initialState = {
  imageURL: "",
  firstName: "",
  surname: "",
  email: "",
  phone: "",
  notes: "",
  starred: false,
};

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState(initialState);
  const [contactsBackup, setContactsBackup] = useState([]);

  useContacts(setContactsBackup, setContacts);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
      />
      <Navbar setContacts={setContacts} contacts={contactsBackup} />
      <Switch>
        <Route path="/new">
          <CreateContact
            newContact={newContact}
            setNewContact={setNewContact}
            initialState={initialState}
          />
        </Route>
        <Route path="/edit/:id">
          <CreateContact
            newContact={newContact}
            setNewContact={setNewContact}
            initialState={initialState}
          />
        </Route>
        <Route exact path="/">
          <Contacts
            contacts={contacts}
            setContacts={setContacts}
            setNewContact={setNewContact}
          />
        </Route>
        <Route path="/person/:email" component={ContactDetails} />
      </Switch>
    </>
  );
}

export default App;
