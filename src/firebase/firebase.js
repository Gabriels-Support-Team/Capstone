import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZO8gDsjmoJl4MUvFs9yvWnrbQfFaRGQg",
  authDomain: "meta-capstone.firebaseapp.com",
  projectId: "meta-capstone",
  storageBucket: "meta-capstone.appspot.com",
  messagingSenderId: "919551358244",
  appId: "1:919551358244:web:e36d3a44f816bc3d1b6fb1",
  measurementId: "G-H9GPS9JDM6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
