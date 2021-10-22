import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import useContacts from "./hooks/useContacts";
import { useEffect, useState } from "react";
import Signup from "./pages/Signup";
import { getAuth } from "@firebase/auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Signin from "./pages/Signin";
import CreateContact from "./components/CreateContact";
import ContactDetails from "./components/ContactDetails";

function App() {
  const [contactsBackup, setContactsBackup] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useContacts(setContactsBackup, setContacts);

  useEffect(() => {
    getAuth().onAuthStateChanged((currentUser) => {
      console.log(`currentUser`, currentUser);
      setCurrentUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/signin">
          {currentUser ? <Redirect to="/" /> : <Signin />}
        </Route>

        <Route exact path="/signup">
          {currentUser ? <Redirect to="/" /> : <Signup />}
        </Route>

        <Route exact path="/new">
          {currentUser ? <CreateContact /> : <Signin />}
        </Route>

        <Route exact path="/person/:id">
          {currentUser ? <ContactDetails /> : <Signin />}
        </Route>

        <Route exact path="/person/edit/:id">
          {currentUser ? <CreateContact /> : <Signin />}
        </Route>

        <Route exact path="/">
          {currentUser ? (
            <Home
              contacts={contacts}
              setContacts={setContacts}
              contactsBackup={contactsBackup}
            />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
