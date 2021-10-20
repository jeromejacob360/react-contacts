import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAu6sdLl1ngCpOdHhx69xWJuBGS8QYUToE",
//   authDomain: "react-android-a923a.firebaseapp.com",
//   projectId: "react-android-a923a",
//   storageBucket: "react-android-a923a.appspot.com",
//   messagingSenderId: "904576134150",
//   appId: "1:904576134150:web:18bad0b3373e9e711ea787",
//   measurementId: "G-X34LE04PGN",
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
