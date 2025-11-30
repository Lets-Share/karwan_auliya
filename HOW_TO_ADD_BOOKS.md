# How to Add Books to Your Web App

This guide explains multiple ways to add books to your Karwan Auliya application.

---

## Method 1: Using Firebase Console (Quick Start)

This is the easiest way to add your first few books. Perfect for testing and adding initial content.

### Step 1: Go to Firestore Database

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your **karwan-auliya** project
3. Click **Firestore Database** in the left sidebar
4. Click **Start collection** if you haven't created the `books` collection yet, or click on the existing `books` collection

### Step 2: Add a New Book Document

1. Click **Add document**
2. For **Document ID**, either:
   - Leave it as **Auto-ID** (recommended)
   - Or enter a custom ID like `book-1`

### Step 3: Add Book Fields

Add the following fields one by one:

| Field Name | Type | Example Value | Description |
|------------|------|---------------|-------------|
| `title` | string | "Sahih Bukhari" | Book title |
| `author` | string | "Imam Bukhari" | Author name |
| `description` | string | "The most authentic collection of Hadith..." | Book description |
| `category` | string | "hadith" | Category: `hadith`, `tafseer`, `fiqh`, `seerah`, `academic`, `fiction` |
| `language` | string | "urdu" | Language: `urdu`, `english`, `arabic` |
| `coverImageUrl` | string | "https://example.com/cover.jpg" | URL to cover image |
| `pdfUrl` | string | "https://storage.googleapis.com/..." | URL to PDF file (see Storage section below) |
| `pdfFileName` | string | "sahih-bukhari.pdf" | Original PDF filename |
| `pageCount` | number | 500 | Number of pages |
| `fileSize` | number | 1024000 | File size in bytes |
| `publishedDate` | string | "2024-01-01" | Publication date |
| `uploadedAt` | string | "2024-11-29T12:00:00Z" | Upload timestamp (ISO format) |
| `downloads` | number | 0 | Download count |
| `averageRating` | number | 0 | Average rating (0-5) |
| `totalReviews` | number | 0 | Total review count |
| `tags` | array | ["hadith", "authentic"] | Tags for searchability |

4. Click **Save**

### Step 4: Upload PDF to Firebase Storage

1. Go to **Storage** in Firebase Console
2. Click on the **books/** folder (create it if it doesn't exist)
3. Click **Upload file**
4. Select your PDF file
5. After upload, click on the file
6. Copy the **Download URL** (token URL)
7. Go back to Firestore and paste this URL in the `pdfUrl` field

### Step 5: Upload Cover Image (Optional)

1. In **Storage**, go to the **covers/** folder
2. Upload your cover image (JPG/PNG)
3. Copy the Download URL
4. Paste it in the `coverImageUrl` field in Firestore

---

## Method 2: Using Admin Panel (Recommended for Production)

For easier book management, you'll want to build an admin panel. Here's how to implement it:

### Step 1: Create Admin User

First, you need to mark your account as an admin:

1. Sign up on your web app
2. Go to Firestore Console
3. Find your user document in the `users` collection
4. Edit the `role` field from `user` to `admin`
5. Save the document

### Step 2: Create Admin Panel (Code Implementation)

I can help you create an admin panel with the following features:

#### Features:
- ✅ Upload PDF files directly from the browser
- ✅ Upload cover images
- ✅ Fill in book details via a form
- ✅ Auto-generate metadata (file size, page count estimates)
- ✅ View all books
- ✅ Edit existing books
- ✅ Delete books

Would you like me to create the admin panel for you? It will include:

1. **Admin Dashboard** (`/admin/dashboard`)
   - Statistics overview
   - Quick actions

2. **Book Upload Page** (`/admin/books/upload`)
   - PDF upload with drag & drop
   - Cover image upload
   - Book details form
   - Category selection
   - Tags management

3. **Book Management Page** (`/admin/books`)
   - List all books
   - Edit/Delete actions
   - Search and filter

---

## Method 3: Bulk Import (Advanced)

For importing many books at once, you can use a script.

### Prerequisites

- Node.js installed
- Firebase Admin SDK

### Example Script

Create a file `scripts/import-books.js`:

```javascript
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Book data
const books = [
  {
    title: "Book 1",
    author: "Author 1",
    category: "hadith",
    // ... other fields
  },
  // Add more books
];

async function importBooks() {
  const batch = db.batch();
  
  books.forEach(book => {
    const docRef = db.collection('books').doc();
    batch.set(docRef, {
      ...book,
      uploadedAt: new Date().toISOString(),
      downloads: 0,
      averageRating: 0,
      totalReviews: 0
    });
  });
  
  await batch.commit();
  console.log('Books imported successfully!');
}

importBooks();
```

Run with: `node scripts/import-books.js`

---

## Quick Reference: Book Schema

```typescript
interface Book {
  // Required fields
  title: string;
  author: string;
  description: string;
  category: 'hadith' | 'tafseer' | 'fiqh' | 'seerah' | 'academic' | 'fiction';
  language: 'urdu' | 'english' | 'arabic';
  
  // URLs
  coverImageUrl: string;
  pdfUrl: string;
  pdfFileName: string;
  
  // Metadata
  pageCount: number;
  fileSize: number; // in bytes
  publishedDate: string; // ISO format
  uploadedAt: string; // ISO format
  
  // Stats
  downloads: number;
  averageRating: number; // 0-5
  totalReviews: number;
  
  // Optional
  tags?: string[];
  isbn?: string;
  publisher?: string;
}
```

---

## Categories Reference

Use these exact strings for the `category` field:

- `hadith` - Hadith collections
- `tafseer` - Quranic exegesis
- `fiqh` - Islamic jurisprudence
- `seerah` - Prophetic biography
- `aqeedah` - Islamic creed
- `history` - Islamic history
- `academic` - Academic works
- `fiction` - Fictional literature
- `general` - General reading

---

## Tips for Best Results

### Cover Images
- **Recommended size**: 600x900px (2:3 ratio)
- **Format**: JPG or PNG
- **File size**: Keep under 500KB

### PDF Files
- **Optimize PDFs** before uploading for faster loading
- **Clear formatting** makes reading easier
- **Bookmarks** in PDF help with navigation

### Descriptions
- Keep between 100-500 characters
- Mention key topics covered
- Include any special features

---

## Next Steps

**Option A:** Start adding books manually via Firebase Console (fastest to test)
**Option B:** Let me build the Admin Panel for you (best for long-term use)

Which would you prefer? 

If you choose Option B, I'll create:
1. Admin authentication check
2. Upload forms with drag & drop
3. Book management interface
4. Image/PDF upload to Firebase Storage
5. Automatic metadata generation
