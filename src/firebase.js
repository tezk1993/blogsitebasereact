// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDamGWE1TGkK5hW3yXOqrz2734yhG1o6Rw",
  authDomain: "blogsite-adf9c.firebaseapp.com",
  projectId: "blogsite-adf9c",
  storageBucket: "blogsite-adf9c.appspot.com",
  messagingSenderId: "901852821034",
  appId: "1:901852821034:web:c804918c9e2af91879b553",
  measurementId: "G-YTDX4M0ECR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export {storage,app,auth, googleProvider,db};