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

function App() {
  const [contactsBackup, setContactsBackup] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    getAuth().onAuthStateChanged((currentUser) => {
      setCurrentUser(currentUser);
      if (!currentUser) {
        setContactsBackup([]);
        setContacts([]);
      }
    });
  }, []);

  useContacts(setContactsBackup, setContacts, currentUser);

  return (
    <>
      {/* <Router>
        <Navbar setContacts={setContacts} contacts={contactsBackup} />
        <Switch>
          <Route exact path="/">
            {currentUser ? (
              <Home
                currentUser={currentUser}
                contacts={contacts}
                setContacts={setContacts}
                contactsBackup={contactsBackup}
              />
            ) : (
              <Redirect to="/signin" />
            )}
          </Route>

          <Route exact path="/signin">
            {currentUser ? <Redirect to="/" /> : <Signin />}
          </Route>

          <Route exact path="/signup">
            {currentUser ? <Redirect to="/" /> : <Signup />}
          </Route>

          <Route exact path="/new">
            {currentUser ? (
              <CreateContact currentUser={currentUser} />
            ) : (
              <Signin />
            )}
          </Route>

          <Route exact path="/person/:id">
            {currentUser ? (
              <ContactDetails currentUser={currentUser} />
            ) : (
              <Signin />
            )}
          </Route>

          <Route exact path="/person/edit/:id">
            {currentUser ? (
              <CreateContact currentUser={currentUser} />
            ) : (
              <Signin />
            )}
          </Route>

          <Route component={PageNotFound} />
        </Switch>
      </Router> */}

      <p>NO ROUTER</p>
    </>
  );
}

export default App;
