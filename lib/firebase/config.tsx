import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_YOUR_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_YOUR_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_YOUR_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_YOUR_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_YOUR_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_YOUR_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_YOUR_APP_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getDatabase(app);

export { db };
