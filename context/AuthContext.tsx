'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin';
    isAdmin?: boolean; // Helper property
    favorites?: string[];
    readingGoals?: any[];
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
    refreshUserData: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                // Fetch user data from Firestore
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        setUserData({
                            ...data,
                            isAdmin: data.role === 'admin'
                        });
                    } else {
                        // Handle case where user exists in Auth but not Firestore (e.g. first google login)
                        // We might want to create the doc here, but for now let's just set null or basic info
                        setUserData(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user doc exists, if not create it
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const { setDoc } = await import('firebase/firestore');
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    favorites: [],
                    readingGoals: []
                });
            }
        } catch (error) {
            console.error('Error signing in with Google', error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!user) return;

        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as UserData;
                setUserData({
                    ...data,
                    isAdmin: data.role === 'admin'
                });
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUserData(null);
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signOut, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
