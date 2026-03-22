import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-a0857.firebaseapp.com",
  projectId: "real-estate-a0857",
  storageBucket: "real-estate-a0857.appspot.com",
  messagingSenderId: "877243908813",
  appId: "1:877243908813:web:509587782682d7bfcc9f84"
};
export const app = initializeApp(firebaseConfig);