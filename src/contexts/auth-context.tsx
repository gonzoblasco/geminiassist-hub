
"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth'; // Actual Firebase
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Actual Firebase
// import { auth, db } from '@/lib/firebase'; // Actual Firebase imports

// Placeholder for Firebase user type and auth service
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
import { auth as placeholderAuth, db as placeholderDb } from '@/lib/firebase'; // Placeholder imports

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Extended mock store for better testing
const mockProfileStore: { [key: string]: UserProfile } = {
  'default-client-uid': { 
    uid: 'default-client-uid',
    email: 'client@example.com',
    displayName: 'Client User',
    photoURL: 'https://placehold.co/100x100.png?text=CU',
    role: 'client',
    createdAt: new Date(Date.now() - 200000),
    updatedAt: new Date(),
    onboardingCompleted: false, 
  },
  'onboarded-client-uid': { 
    uid: 'onboarded-client-uid',
    email: 'onboarded@example.com',
    displayName: 'Onboarded Client',
    photoURL: 'https://placehold.co/100x100.png?text=OC',
    role: 'client',
    createdAt: new Date(Date.now() - 200000),
    updatedAt: new Date(),
    onboardingCompleted: true, 
  },
   'admin-user-uid': {
    uid: 'admin-user-uid',
    email: 'admin@example.com',
    displayName: 'Admin User',
    photoURL: 'https://placehold.co/100x100.png?text=AU',
    role: 'admin',
    createdAt: new Date(Date.now() - 100000),
    updatedAt: new Date(),
    onboardingCompleted: true,
  }
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = placeholderAuth.onAuthStateChanged(async (fbUser: FirebaseUser | null) => { 
      setLoading(true); // Set loading true at the start of auth state change
      if (fbUser) {
        setFirebaseUser(fbUser);
        
        await new Promise(resolve => setTimeout(resolve, 200)); // simulate delay
        
        let userDocData: UserProfile | null = null;

        // Prioritize specific mock UIDs for consistent testing
        if (mockProfileStore[fbUser.uid]) {
            userDocData = mockProfileStore[fbUser.uid];
        } else if (fbUser.email?.includes('admin')) { // Fallback for generic admin email
            userDocData = mockProfileStore['admin-user-uid'];
            if (userDocData) userDocData.uid = fbUser.uid; // Align UID
        } else { // Fallback for generic client email
            userDocData = mockProfileStore['default-client-uid'];
             if (userDocData) userDocData.uid = fbUser.uid; // Align UID
        }


        if (userDocData) {
          setUserProfile({...userDocData, email: fbUser.email, displayName: fbUser.displayName, photoURL: fbUser.photoURL });
        } else {
          // Create a new default profile if no match
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || `User ${fbUser.uid.substring(0,5)}`,
            photoURL: fbUser.photoURL || `https://placehold.co/100x100.png?text=${fbUser.displayName ? fbUser.displayName[0] : 'U'}`,
            role: fbUser.email?.includes('admin@example.com') ? 'admin' : 'client',
            createdAt: new Date(),
            updatedAt: new Date(),
            onboardingCompleted: fbUser.email?.includes('admin@example.com') ? true : false, // Admins are onboarded by default
          };
          setUserProfile(newProfile);
          mockProfileStore[fbUser.uid] = newProfile; // Add to mock store
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    await placeholderAuth.signOut();
    // No need to setFirebaseUser/setUserProfile to null here, 
    // onAuthStateChanged will trigger and handle it.
    // setLoading(false); // onAuthStateChanged will set loading to false
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user: userProfile, firebaseUser, loading, isAdmin, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
