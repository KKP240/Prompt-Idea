import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZvT7Pm6xRVJOBfssJlgLAxunQIVrvG_g",
  authDomain: "prompt-idea-ffa97.firebaseapp.com",
  projectId: "prompt-idea-ffa97",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);