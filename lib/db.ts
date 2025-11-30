import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Book, Review, ReadingProgress, ReadingGoal, Favorite } from '@/types';

// ==================== BOOKS ====================

export async function getAllBooks(): Promise<Book[]> {
    const booksRef = collection(db, 'books');
    const q = query(booksRef, orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
    })) as Book[];
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
    const booksRef = collection(db, 'books');
    const q = query(
        booksRef,
        where('category', '==', category),
        orderBy('uploadedAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
    })) as Book[];
}

export async function getBookById(bookId: string): Promise<Book | null> {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);

    if (!bookSnap.exists()) return null;

    return {
        id: bookSnap.id,
        ...bookSnap.data(),
        uploadedAt: bookSnap.data().uploadedAt?.toDate() || new Date(),
    } as Book;
}

export async function searchBooks(searchTerm: string): Promise<Book[]> {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar
    const booksRef = collection(db, 'books');
    const snapshot = await getDocs(booksRef);

    const searchLower = searchTerm.toLowerCase();

    return snapshot.docs
        .map(doc => ({
            id: doc.id,
            ...doc.data(),
            uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
        }) as Book)
        .filter(book =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.description.toLowerCase().includes(searchLower)
        );
}

// ==================== REVIEWS ====================

export async function getBookReviews(bookId: string): Promise<Review[]> {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
        reviewsRef,
        where('bookId', '==', bookId),
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Review[];
}

export async function addReview(
    bookId: string,
    userId: string,
    userName: string,
    rating: number,
    reviewText: string
): Promise<string> {
    const reviewsRef = collection(db, 'reviews');

    const reviewData = {
        bookId,
        userId,
        userName,
        rating,
        reviewText,
        isApproved: false, // Requires moderation
        createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(reviewsRef, reviewData);

    // Update book's average rating (simplified - should use Cloud Function)
    await updateBookRating(bookId);

    return docRef.id;
}

async function updateBookRating(bookId: string) {
    const reviews = await getBookReviews(bookId);
    const approvedReviews = reviews.filter(r => r.isApproved);

    if (approvedReviews.length === 0) return;

    const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;

    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, {
        averageRating: Number(avgRating.toFixed(1)),
        totalReviews: approvedReviews.length,
    });
}

// ==================== READING PROGRESS ====================

export async function saveReadingProgress(
    userId: string,
    bookId: string,
    lastPage: number,
    totalPages: number
): Promise<void> {
    const progressRef = collection(db, 'reading_progress');
    const q = query(
        progressRef,
        where('userId', '==', userId),
        where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);

    const progressData = {
        userId,
        bookId,
        lastPage,
        totalPages,
        lastReadAt: Timestamp.now(),
    };

    if (snapshot.empty) {
        await addDoc(progressRef, { ...progressData, timeSpent: 0 });
    } else {
        const docRef = doc(db, 'reading_progress', snapshot.docs[0].id);
        await updateDoc(docRef, progressData);
    }
}

export async function getReadingProgress(
    userId: string,
    bookId: string
): Promise<ReadingProgress | null> {
    const progressRef = collection(db, 'reading_progress');
    const q = query(
        progressRef,
        where('userId', '==', userId),
        where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
        lastReadAt: doc.data().lastReadAt?.toDate() || new Date(),
    } as ReadingProgress;
}

// ==================== FAVORITES ====================

export async function addFavorite(userId: string, bookId: string): Promise<void> {
    const favoritesRef = collection(db, 'favorites');
    await addDoc(favoritesRef, {
        userId,
        bookId,
        addedAt: Timestamp.now(),
    });
}

export async function removeFavorite(userId: string, bookId: string): Promise<void> {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
        favoritesRef,
        where('userId', '==', userId),
        where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);

    snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
}

export async function getUserFavorites(userId: string): Promise<string[]> {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => doc.data().bookId);
}

export async function isFavorite(userId: string, bookId: string): Promise<boolean> {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
        favoritesRef,
        where('userId', '==', userId),
        where('bookId', '==', bookId)
    );
    const snapshot = await getDocs(q);

    return !snapshot.empty;
}

// ==================== READING GOALS ====================

export async function createGoal(
    userId: string,
    type: 'books' | 'pages',
    target: number,
    period: 'weekly' | 'monthly'
): Promise<string> {
    const goalsRef = collection(db, 'goals');

    // Deactivate previous goals
    const previousGoals = query(goalsRef, where('userId', '==', userId), where('isActive', '==', true));
    const snapshot = await getDocs(previousGoals);
    snapshot.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, { isActive: false });
    });

    const startDate = new Date();
    const endDate = new Date();
    if (period === 'weekly') {
        endDate.setDate(endDate.getDate() + 7);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    const goalData = {
        userId,
        type,
        target,
        current: 0,
        period,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        isActive: true,
    };

    const docRef = await addDoc(goalsRef, goalData);
    return docRef.id;
}

export async function getActiveGoal(userId: string): Promise<ReadingGoal | null> {
    const goalsRef = collection(db, 'goals');
    const q = query(
        goalsRef,
        where('userId', '==', userId),
        where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
    } as ReadingGoal;
}
