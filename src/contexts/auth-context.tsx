
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
  isAdmin: boolean; // Convenience getter
  signOut: () => Promise<void>; // Added signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = placeholderAuth.onAuthStateChanged(async (fbUser: FirebaseUser | null) => { 
      if (fbUser) {
        setFirebaseUser(fbUser);
        
        // Placeholder for fetching or creating user profile
        // const userDocRef = doc(db, 'users', fbUser.uid); // Actual Firebase
        // const userDocSnap = await getDoc(userDocRef); // Actual Firebase
        
        let userDocData: UserProfile | null = null;
        
        // Simulate Firestore fetch
        await new Promise(resolve => setTimeout(resolve, 200)); // simulate delay
        const mockProfileStore: { [key: string]: UserProfile } = {
          '123': { // Assuming '123' is a common test UID from placeholderAuth
            uid: '123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://placehold.co/100x100.png?text=TU',
            role: 'client', // Default to client for testing onboarding
            createdAt: new Date(Date.now() - 100000),
            updatedAt: new Date(),
            onboardingCompleted: false, // Set to false to test onboarding flow initially
          },
           'admin-user-uid': {
            uid: 'admin-user-uid', // A UID that might be used for admin
            email: 'admin@example.com',
            displayName: 'Admin User',
            photoURL: 'https://placehold.co/100x100.png?text=AU',
            role: 'admin',
            createdAt: new Date(Date.now() - 100000),
            updatedAt: new Date(),
            onboardingCompleted: true, // Admins likely skip client onboarding
          }
        };
        
        // Try to get a profile; if fbUser.uid is 'admin-user-uid', use that, otherwise try '123'
        userDocData = fbUser.email?.includes('admin') ? mockProfileStore['admin-user-uid'] : mockProfileStore[fbUser.uid] || null;

        if (userDocData) {
          setUserProfile(userDocData);
        } else {
          // If no specific mock, create a default one based on fbUser
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || `User ${fbUser.uid.substring(0,5)}`,
            photoURL: fbUser.photoURL || `https://placehold.co/100x100.png?text=${fbUser.displayName ? fbUser.displayName[0] : 'U'}`,
            role: fbUser.email?.includes('admin@example.com') ? 'admin' : 'client', // Role determination
            createdAt: new Date(),
            updatedAt: new Date(),
            onboardingCompleted: false, // Default for new users
          };
          // In a real app, save this newProfile to Firestore:
          // await setDoc(userDocRef, { ...newProfile, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
          setUserProfile(newProfile);
          mockProfileStore[fbUser.uid] = newProfile; // Add to mock store for session consistency
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
    // await firebaseSignOut(auth); // Actual Firebase
    await placeholderAuth.signOut(); // Placeholder Firebase
    setFirebaseUser(null);
    setUserProfile(null);
    setLoading(false);
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
