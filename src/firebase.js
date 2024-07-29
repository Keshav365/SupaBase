// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail as updateEmailFn, updatePassword as updatePasswordFn } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Function to get all documents for a user from a specific collection
const getUserFiles = async (userId, collectionName) => {
  const q = query(collection(db, collectionName), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// Function to calculate total storage used by a user
const calculateStorageUsed = async (userId) => {
  const userFiles = await getUserFiles(userId, 'files');
  const userTrash = await getUserFiles(userId, 'trash');

  const totalStorageUsed = [...userFiles, ...userTrash].reduce((total, file) => {
    return total + (file.size || 0);
  }, 0);

  return totalStorageUsed;
};

// Export database methods and utilities
export const database = {
  addFile: (fileData) => addDoc(collection(db, 'files'), fileData),
  addFolder: (folderData) => addDoc(collection(db, 'folders'), folderData),
  addFavourite: (favouriteData) => addDoc(collection(db, 'favourites'), favouriteData),
  addTrash: (trashData) => addDoc(collection(db, 'trash'), trashData),
  addUsername: (userData) => addDoc(collection(db, 'UserNames'), userData),
  updateFilePath: (fileId, newFilePath) => updateDoc(doc(db, 'files', fileId), { url: newFilePath }),
  updateDocument: (collectionName, documentId, updates) => updateDoc(doc(db, collectionName, documentId), updates),
  deleteFileFromTrash: (fileId) => deleteDoc(doc(db, 'trash', fileId)),
  deleteFile: (fileId) => deleteDoc(doc(db, 'files', fileId)),
  removeFromFavourites: async (fileId) => {
    const favQuery = query(collection(db, 'favourites'), where('originalFileId', '==', fileId));
    const favSnapshot = await getDocs(favQuery);
    favSnapshot.forEach((doc) => deleteDoc(doc.ref));
  },
  removeFromTrash: async (fileId) => {
    const trashQuery = query(collection(db, 'trash'), where('originalFileId', '==', fileId));
    const trashSnapshot = await getDocs(trashQuery);
    trashSnapshot.forEach((doc) => deleteDoc(doc.ref));
  },
  getUserFiles,
  calculateStorageUsed,
  formatDoc: (doc) => ({ id: doc.id, ...doc.data() }),
  getCurrentTimestamp: serverTimestamp,
};

// Initialize Firebase Storage
const storage = getStorage(app);

// Export Firebase Auth and Storage methods
export {calculateStorageUsed, db, auth, storage, ref, uploadBytesResumable, getDownloadURL, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmailFn as updateEmail, updatePasswordFn as updatePassword };

// Export the default Firebase app instance
export default app;
