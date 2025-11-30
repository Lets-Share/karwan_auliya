import { collection, doc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'user' | 'admin';
    createdAt?: string;
    isAdmin?: boolean;
}

// Get all users
export async function getUsers(): Promise<UserData[]> {
    const usersRef = collection(db, 'users');
    // Try to order by createdAt if index exists, otherwise just get all
    try {
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
    } catch (error) {
        // Fallback if index missing
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
    }
}

// Update user role
export async function updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
}
