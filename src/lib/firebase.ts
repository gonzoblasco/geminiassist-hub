// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const functions = getFunctions(app); // Optional: specify region

// export { app, auth, db, storage, functions };

// This is a placeholder. Actual Firebase setup requires:
// 1. Creating a Firebase project.
// 2. Adding a Web App to your Firebase project.
// 3. Copying the firebaseConfig from your Firebase project settings.
// 4. Installing the Firebase SDK: npm install firebase
// 5. Setting up environment variables (e.g., .env.local) for your config.
// 6. Uncommenting and using the Firebase services.

export const placeholderAuth = {
  // Mock auth functions
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate auth state change after a delay
    setTimeout(() => {
      // To test logged-out state: callback(null);
      // To test logged-in state:
      // callback({ uid: '123', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://placehold.co/40x40' });
    }, 1000);
    return () => {}; // Unsubscribe function
  },
  signInWithPopup: async () => {
    // Simulate Google sign-in
    return { user: { uid: '123', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://placehold.co/40x40' } };
  },
  signOut: async () => {
    // Simulate sign-out
  }
};

export const placeholderDb = {
  // Mock Firestore functions
  collection: (path: string) => ({
    // Mock collection methods
    getDocs: async () => ({ docs: [] }), // Simulate fetching documents
    addDoc: async (data: any) => ({ id: 'mockDocId', ...data }), // Simulate adding a document
  }),
  doc: (path: string) => ({
    // Mock doc methods
    getDoc: async () => ({ exists: () => false, data: () => undefined }),
    setDoc: async (data: any) => {},
    updateDoc: async (data: any) => {},
    deleteDoc: async () => {},
  }),
};

// Ensure placeholder functions are exported if real Firebase is not set up
export const auth = placeholderAuth;
export const db = placeholderDb;
