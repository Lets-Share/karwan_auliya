# Firebase Setup Guide - Firestore Database & Storage

This guide will walk you through setting up Firebase Firestore Database and Storage for the Karwan Auliya application.

## Prerequisites

- A Google account
- Node.js installed (v18 or higher)
- Your Karwan Auliya project initialized

---

## Part 1: Firebase Project Setup

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name: `karwan-auliya`
4. Click **Continue**
5. (Optional) Enable Google Analytics if you want analytics
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Register your app:
   - **App nickname**: `Karwan Auliya Web`
   - Check **"Also set up Firebase Hosting"** (optional, for deployment later)
3. Click **Register app**
4. **Copy the Firebase configuration** - you'll need this later:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

5. Click **Continue to console**

---

## Part 2: Firestore Database Setup

### Step 1: Create Firestore Database

1. In the Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose your security mode:
   - **Production mode** (recommended for now - we'll update rules later)
   - Or **Test mode** (allows read/write access for 30 days - good for development)
4. Click **Next**
5. Select your **Firestore location** (choose closest to your users):
   - For Pakistan/Middle East: `asia-south1 (Mumbai)`
   - This **cannot be changed later**, so choose carefully
6. Click **Enable**

### Step 2: Configure Security Rules

1. Click on the **"Rules"** tab in Firestore
2. Replace the default rules with these initial rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Books collection - read by all, write by admin only
    match /books/{bookId} {
      allow read: if true;
      allow write: if isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isOwner(userId);
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Favorites collection
    match /favorites/{favoriteId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // Reading goals collection
    match /readingGoals/{goalId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

### Step 3: Create Initial Collections

You can create collections either manually or let your app create them automatically. To create them manually:

1. Click **"Start collection"**
2. Create these collections one by one:
   - `books`
   - `users`
   - `reviews`
   - `favorites`
   - `readingGoals`

For each collection, add a sample document (you can delete it later):
- **Collection ID**: `books`
- **Document ID**: Auto-ID
- **Fields**: 
  - `title` (string): "Sample Book"
  - `author` (string): "Sample Author"

---

## Part 3: Firebase Storage Setup

### Step 1: Create Storage Bucket

1. In the Firebase Console, click **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Review the security rules dialog:
   - Choose **"Start in production mode"** (we'll customize rules next)
4. Click **Next**
5. Confirm your **Storage location** (should match your Firestore location)
6. Click **Done**

### Step 2: Configure Storage Security Rules

1. Click on the **"Rules"** tab in Storage
2. Replace the default rules with these:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Book PDFs - read by all, upload by admin only
    match /books/{bookId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Book covers - read by all, upload by admin only
    match /covers/{coverId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // User profile pictures
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

### Step 3: Create Storage Folders

1. Click on the **"Files"** tab
2. Create these folders by uploading a placeholder file to each:
   - `books/` - for PDF files
   - `covers/` - for book cover images
   - `users/` - for user profile pictures

---

## Part 4: Setup Firebase Authentication

### Step 1: Enable Authentication Methods

1. In the Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:

#### Enable Email/Password:
1. Click **"Email/Password"**
2. Toggle **"Enable"**
3. Click **Save**

#### Enable Google Sign-In (Optional):
1. Click **"Google"**
2. Toggle **"Enable"**
3. Enter your **Project support email**
4. Click **Save**

---

## Part 5: Install Firebase SDK in Your Project

### Step 1: Install Firebase Dependencies

```bash
npm install firebase
# or
yarn add firebase
```

### Step 2: Create Firebase Configuration File

Create a new file: `lib/firebase.js` or `config/firebase.js`

```javascript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (avoid multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

### Step 3: Create Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Important**: Add `.env.local` to your `.gitignore` file!

---

## Part 6: Usage Examples

### Firestore - Reading Data

```javascript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Get all books
async function getAllBooks() {
  const booksRef = collection(db, 'books');
  const snapshot = await getDocs(booksRef);
  const books = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return books;
}

// Get books by category
async function getBooksByCategory(category) {
  const booksRef = collection(db, 'books');
  const q = query(booksRef, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### Firestore - Writing Data

```javascript
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Add a new book
async function addBook(bookData) {
  const booksRef = collection(db, 'books');
  const docRef = await addDoc(booksRef, {
    ...bookData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

// Update a book
async function updateBook(bookId, updates) {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, updates);
}
```

### Storage - Upload Files

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Upload a book PDF
async function uploadBookPDF(bookId, file) {
  const storageRef = ref(storage, `books/${bookId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

// Upload a cover image
async function uploadCoverImage(file) {
  const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
```

### Storage - Download Files

```javascript
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Get download URL for a PDF
async function getBookPDFUrl(bookId, fileName) {
  const storageRef = ref(storage, `books/${bookId}/${fileName}`);
  const url = await getDownloadURL(storageRef);
  return url;
}
```

### Authentication - Sign Up

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

async function signUp(email, password, displayName) {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    displayName: displayName,
    role: 'user',
    createdAt: new Date().toISOString(),
    favorites: [],
    readingGoals: []
  });
  
  return user;
}
```

### Authentication - Sign In

```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}
```

---

## Part 7: Database Schema Recommendations

### Books Collection (`books/{bookId}`)

```javascript
{
  title: "Book Title",
  author: "Author Name",
  description: "Book description...",
  category: "tafseer", // or "hadith", "fiqh", etc.
  language: "urdu",
  coverImageUrl: "https://...",
  pdfUrl: "https://...",
  pdfFileName: "book.pdf",
  pageCount: 500,
  fileSize: 1024000, // in bytes
  publishedDate: "2024-01-01",
  uploadedBy: "adminUserId",
  uploadedAt: "2024-01-01T00:00:00Z",
  downloads: 0,
  averageRating: 4.5,
  totalReviews: 10,
  tags: ["tag1", "tag2"]
}
```

### Users Collection (`users/{userId}`)

```javascript
{
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://...",
  role: "user", // or "admin"
  createdAt: "2024-01-01T00:00:00Z",
  favorites: ["bookId1", "bookId2"],
  readingStreak: 5,
  totalBooksRead: 10
}
```

### Reviews Collection (`reviews/{reviewId}`)

```javascript
{
  bookId: "bookId",
  userId: "userId",
  userName: "User Name",
  rating: 5,
  comment: "Great book!",
  createdAt: "2024-01-01T00:00:00Z"
}
```

---

## Part 8: Testing Your Setup

### Test Firestore Connection

Create a test file: `test-firebase.js`

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

async function testFirestore() {
  try {
    const testRef = collection(db, 'test');
    const docRef = await addDoc(testRef, {
      message: 'Hello Firestore!',
      timestamp: new Date()
    });
    console.log('✅ Firestore connected! Document ID:', docRef.id);
  } catch (error) {
    console.error('❌ Firestore error:', error);
  }
}

testFirestore();
```

Run: `node test-firebase.js`

---

## Next Steps

1. ✅ Firebase project created
2. ✅ Firestore database configured
3. ✅ Storage bucket set up
4. ✅ Authentication enabled
5. ✅ SDK installed
6. 🔄 Integrate Firebase into your Next.js components
7. 🔄 Build admin panel for book uploads
8. 🔄 Implement user features (favorites, reviews, etc.)

---

## Security Best Practices

1. **Never commit your `.env.local`** file to Git
2. **Use Firebase Security Rules** to protect your data
3. **Validate all user inputs** before saving to Firestore
4. **Limit file upload sizes** in Storage (e.g., max 50MB for PDFs)
5. **Use Firebase Authentication** to verify users
6. **Set up billing alerts** in Google Cloud Console
7. **Monitor usage** regularly in Firebase Console

---

## Troubleshooting

### Issue: "Permission Denied" errors

**Solution**: Check your Firestore/Storage security rules and ensure users are authenticated.

### Issue: "Firebase App not initialized"

**Solution**: Make sure you're importing from the correct Firebase config file.

### Issue: Environment variables not loading

**Solution**: Restart your Next.js dev server after adding `.env.local` variables.

### Issue: Large files not uploading

**Solution**: Check Storage bucket quotas and file size limits.

---

## Useful Firebase Console Links

- **Firebase Console**: https://console.firebase.google.com/
- **Firestore Database**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore`
- **Storage**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage`
- **Authentication**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication`
- **Usage & Billing**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/usage`

---

## Firebase Free Tier Limits

- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5 GB total storage, 1 GB/day downloads
- **Authentication**: Unlimited users

For production with more traffic, you'll need the **Blaze (Pay as you go)** plan.

---

**You're all set! 🎉** Your Firebase Firestore Database and Storage are ready to use.
