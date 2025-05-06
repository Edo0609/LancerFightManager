import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAkVb8v9OhyYCM_WS10-OKCQYa2cMthVUA",
  authDomain: "lancerfightmanager.firebaseapp.com",
  databaseURL: "https://lancerfightmanager-default-rtdb.firebaseio.com",
  projectId: "lancerfightmanager",
  storageBucket: "lancerfightmanager.firebasestorage.app",
  messagingSenderId: "554429082399",
  appId: "1:554429082399:web:4c31894076bd7360f7de2a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 