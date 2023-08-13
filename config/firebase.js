import { getApp, getApps, initializeApp, initializeAuth } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCfOLtgV2WApCGuh1Ek6DigXhHNVPoNFC0",
  authDomain: "chat-app-pruthvi.firebaseapp.com",
  projectId: "chat-app-pruthvi",
  storageBucket: "chat-app-pruthvi.appspot.com",
  messagingSenderId: "840575474383",
  appId: "1:840575474383:web:47d7b2fd6a7668863c75ba",
  measurementId: "G-3KV92LXRPN",
};
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);
/**
 *
 * @param {*} uri
 * @param {*} name
 */
const uploadToFirebase = async (uri, name, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  const imageRef = ref(getStorage(), `images/${name}`);
  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
          console.log("Resolve ", downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export { app, firebaseAuth, firestoreDB, uploadToFirebase };
