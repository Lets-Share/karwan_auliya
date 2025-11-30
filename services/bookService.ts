import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Book {
    id?: string;
    title: string;
    author: string;
    description: string;
    category: string;
    language: string;
    coverImageUrl: string;
    pdfUrl: string;
    pdfFileName: string;
    pageCount?: number;
    fileSize?: number;
    publishedDate?: string;
    uploadedAt: string;
    downloads: number;
    averageRating: number;
    totalReviews: number;
    tags?: string[];
}

// Create a new book
export async function createBook(bookData: Omit<Book, 'id'>): Promise<string> {
    const booksRef = collection(db, 'books');
    const docRef = await addDoc(booksRef, {
        ...bookData,
        uploadedAt: new Date().toISOString(),
        downloads: 0,
        averageRating: 0,
        totalReviews: 0
    });
    return docRef.id;
}

// Update a book
export async function updateBook(bookId: string, updates: Partial<Book>): Promise<void> {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, updates);
}

// Delete a book
export async function deleteBook(bookId: string): Promise<void> {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
}

// Get all books
export async function getBooks(filters?: { category?: string; language?: string }): Promise<Book[]> {
    let booksQuery = query(collection(db, 'books'));

    if (filters?.category) {
        booksQuery = query(booksQuery, where('category', '==', filters.category));
    }

    if (filters?.language) {
        booksQuery = query(booksQuery, where('language', '==', filters.language));
    }

    const snapshot = await getDocs(booksQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
}

// Get a single book by ID
export async function getBookById(bookId: string): Promise<Book | null> {
    const bookRef = doc(db, 'books', bookId);
    const bookSnap = await getDoc(bookRef);

    if (bookSnap.exists()) {
        return { id: bookSnap.id, ...bookSnap.data() } as Book;
    }
    return null;
}

// Increment download count
export async function incrementDownloads(bookId: string): Promise<void> {
    const book = await getBookById(bookId);
    if (book) {
        await updateBook(bookId, { downloads: (book.downloads || 0) + 1 });
    }
}
