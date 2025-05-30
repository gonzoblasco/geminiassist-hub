
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


// --- Mocking utilities ---
let mockCurrentUser: any = null;
let onAuthStateChangedCallbackInstance: ((user: any) => void) | null = null;
let authStateTimerId: NodeJS.Timeout | null = null;

// Helper to simulate auth state changes for the mock
export function __setMockUser(user: any) {
  mockCurrentUser = user;
  if (onAuthStateChangedCallbackInstance) {
    // Simulate the async nature of onAuthStateChanged
    setTimeout(() => {
      if (onAuthStateChangedCallbackInstance) {
        onAuthStateChangedCallbackInstance(mockCurrentUser);
      }
    }, 0);
  }
}
// --- End of mocking utilities ---


export const placeholderAuth = {
  onAuthStateChanged: (callback: (user: any) => void) => {
    onAuthStateChangedCallbackInstance = callback;
    // Clear previous timer if any to avoid multiple triggers on HMR
    if (authStateTimerId) clearTimeout(authStateTimerId);

    authStateTimerId = setTimeout(() => {
      if (onAuthStateChangedCallbackInstance) {
        // Call with the current mock user (initially null)
        onAuthStateChangedCallbackInstance(mockCurrentUser);
      }
    }, 100); // Reduced delay for faster initial load simulation

    return () => { // Unsubscribe function
      if (authStateTimerId) clearTimeout(authStateTimerId);
      onAuthStateChangedCallbackInstance = null; // Clear the stored callback
    };
  },
  signInWithPopup: async () => {
    // Simulate Google sign-in. You can change the UID to test different users from mockProfileStore
    const signedInUser = {
      uid: 'default-client-uid', // Example: 'onboarded-client-uid' or 'admin-user-uid'
      email: 'client@example.com',
      displayName: 'Client User',
      photoURL: 'https://placehold.co/40x40.png?text=CU'
    };
    // To test admin login, you might set:
    // const signedInUser = { uid: 'admin-user-uid', email: 'admin@example.com', displayName: 'Admin User', photoURL: 'https://placehold.co/40x40.png?text=AU' };
    
    __setMockUser(signedInUser); // Update mock state and trigger onAuthStateChanged
    return { user: signedInUser };
  },
  signOut: async () => {
    __setMockUser(null); // Update mock state to null and trigger onAuthStateChanged
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
