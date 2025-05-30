"use client";

import type { UserProfile } from '@/types';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
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
    // const unsubscribe = onAuthStateChanged(auth, async (fbUser) => { // Actual Firebase
    const unsubscribe = placeholderAuth.onAuthStateChanged(async (fbUser: FirebaseUser | null) => { // Placeholder Firebase
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Fetch user profile from Firestore
        // const userDocRef = doc(db, 'users', fbUser.uid); // Actual Firebase
        // const userDocSnap = await getDoc(userDocRef); // Actual Firebase
        
        // Placeholder for fetching user profile
        const userDocSnap = {
          exists: () => true,
          data: () => ({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: fbUser.email?.includes('admin') ? 'admin' : 'client', // Simple role logic for placeholder
            createdAt: new Date(),
            updatedAt: new Date(),
            onboardingCompleted: false,
          } as UserProfile)
        };


        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not Firestore (e.g., create profile)
          // For now, just set to null or a default client profile
          const defaultProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: 'client',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUserProfile(defaultProfile);
          // Potentially create this doc in Firestore here
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user: userProfile, firebaseUser, loading, isAdmin }}>
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
