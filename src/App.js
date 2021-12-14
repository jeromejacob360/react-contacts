import Home from './pages/Home';
import { useEffect, useState } from 'react';
import Signup from './pages/Signup';
import { getAuth } from '@firebase/auth';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Signin from './pages/Signin';
import CreateContact from './components/CreateContact';
import ContactDetails from './components/ContactDetails';
import Navbar from './components/Navbar';
import useContacts from './hooks/useContacts';
import PageNotFound from './pages/PageNotFound';
import EditUser from './pages/EditUser';

function App() {
  const [contactsBackup, setContactsBackup] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [starredContact, setStarredContact] = useState(false);

  useEffect(() => {
    setStarredContact(false);
    contacts.forEach((contact) => {
      if (contact.starred) {
        setStarredContact(true);
        return;
      }
    });
  }, [contacts]);

  useEffect(() => {
    getAuth().onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
      if (!currentUser) {
        setContactsBackup([]);
        setContacts([]);
      }
    });
  }, []);

  useContacts(setContactsBackup, setContacts, currentUser, setLoading);

  return (
    <>
      <Router>
        {currentUser && (
          <Navbar
            loading={loading}
            setContacts={setContacts}
            contacts={contactsBackup}
          />
        )}
        <Switch>
          <Route exact path="/">
            {currentUser ? (
              <Home
                starredContact={starredContact}
                currentUser={currentUser}
                contacts={contacts}
                setContacts={setContacts}
                contactsBackup={contactsBackup}
                loading={loading}
              />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>

          <Route exact path="/signin">
            {currentUser ? (
              <Redirect to="/" />
            ) : (
              <Signin setLoading={setLoading} />
            )}
          </Route>

          <Route exact path="/signup">
            {currentUser ? <Redirect to="/" /> : <Signup />}
          </Route>

          <Route exact path="/new">
            {currentUser ? (
              <CreateContact currentUser={currentUser} />
            ) : (
              <Signin setLoading={setLoading} />
            )}
          </Route>

          <Route exact path="/person/:id">
            {currentUser ? (
              <ContactDetails currentUser={currentUser} />
            ) : (
              <Signin setLoading={setLoading} />
            )}
          </Route>

          <Route path="/person/edit/:id">
            {currentUser ? (
              <CreateContact currentUser={currentUser} />
            ) : (
              <Signin setLoading={setLoading} />
            )}
          </Route>

          <Route path="/user/edit">
            {currentUser ? <EditUser /> : <Signin setLoading={setLoading} />}
          </Route>

          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
