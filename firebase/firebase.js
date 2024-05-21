import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD856_p6ESQJoYx8qMXtkWPe5eZLpG1WsQ",
  authDomain: "leconnectionsarchive.firebaseapp.com",
  projectId: "leconnectionsarchive",
  appId: "1:1088319996346:web:6b2756886d563b81e19d83",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const publishData = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "answers"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

