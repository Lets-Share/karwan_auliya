import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug: Log configuration status (only first 3 chars of API key for security)
if (typeof window !== 'undefined') {
    console.log('🔥 Firebase Config Status:', {
        apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 3)}...` : 'MISSING',
        authDomain: firebaseConfig.authDomain || 'MISSING',
        projectId: firebaseConfig.projectId || 'MISSING',
        configured: !!firebaseConfig.apiKey && !!firebaseConfig.projectId
    });
}

// Initialize Firebase
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Disable offline persistence to prevent "client is offline" errors in production
// This is a known issue with Firestore persistence in some deployment environments
if (typeof window !== 'undefined') {
    import('firebase/firestore').then(({ enableIndexedDbPersistence, disableNetwork, enableNetwork }) => {
        // Ensure network is enabled
        enableNetwork(db).catch(err => {
            console.warn('⚠️ Could not enable Firestore network:', err);
        });
    });
}

export default app;
