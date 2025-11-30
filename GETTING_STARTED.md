# Karwan Auliya - Getting Started Guide

## 🚀 Installation & Setup

### Step 1: Install Node.js Dependencies

Due to network issues with npm, you have two options:

**Option A: Retry npm install**
```bash
cd d:\library\karwan_auliya
npm install
```

**Option B: Use yarn (if npm fails)**
```bash
# Install yarn if you don't have it
npm install -g yarn

# Then install dependencies
cd d:\library\karwan_auliya
yarn install
```

### Step 2: Set up Firebase (Required for full functionality)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "karwan-auliya"
3. Enable the following services:
   - **Authentication** → Email/Password
   - **Firestore Database**
   - **Storage**
4. Copy your Firebase config and update `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Run the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser!

---

## ✅ What's Working Now

### Completed Features:
- ✅ **Home Page** - Hero section, stats, categories, featured books
- ✅ **Authentication** - Login & Registration with validation
- ✅ **Library** - Browse books with search, filters, sorting
- ✅ **Book Detail** - View book info, reviews, ratings
- ✅ **PDF Reader** - Read books with page navigation, zoom, fullscreen
- ✅ **Favorites** - Save and manage favorite books
- ✅ **Reading Goals** - Set and track reading goals
- ✅ **Dark/Light Theme** - Toggle theme with persistent storage
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **PWA Ready** - Installable as mobile app

---

## 📝 Next Steps

### To Add Books (as Admin):

1. **Create an admin user** in Firebase Console:
   - Go to Firestore Database
   - Create a document in `users` collection
   - Set `isAdmin: true`

2. **Upload books via Firebase Storage**:
   - Upload PDF files to Storage
   - Get the download URLs
   - Add book documents to Firestore `books` collection with:
     ```json
     {
       "title": "Book Title",
       "author": "Author Name",
       "description": "Book description",
       "category": "Islamic Studies",
       "pdfURL": "firebase_storage_url",
       "coverImageURL": "optional_cover_url",
       "averageRating": 0,
       "totalReviews": 0,
       "uploadedAt": "current_timestamp"
     }
     ```

### To Build for Production:

```bash
npm run build
npm start
```

### To Convert to Mobile APK:

**Method 1: Using Capacitor**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Karwan Auliya" com.karwanauliya.app
npx cap add android
npm run build
npx cap copy
npx cap open android
```

**Method 2: Using PWA Builder**
1. Deploy your app online (Vercel/Netlify)
2. Visit [pwabuilder.com](https://www.pwabuilder.com)
3. Enter your URL
4. Download Android APK

---

## 🎨 Customization

### Change Colors:
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#0B6E4F', // Change this
    light: '#10A881',   // And this
  },
}
```

### Add Your Logo:
Replace the 📚 emoji in:
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `app/page.tsx`

---

## 🐛 Troubleshooting

**Problem: npm install fails**
- Solution: Use `yarn install` instead

**Problem: Firebase errors**
- Solution: Check `.env.local` has correct Firebase credentials

**Problem: PDF not loading**
- Solution: Ensure PDF URL is publicly accessible

**Problem: Dark mode not working**
- Solution: Clear browser cache and reload

---

## 📱 Features to Add (Optional)

- Admin Panel (for managing books)
- Profile Page (edit user profile)
- Password Reset
- Social Login (Google, Facebook)
- Book Search improvements
- Comments on reviews
- Reading statistics
- Badges/Achievements

---

## 🚢 Deployment

### Deploy to Vercel (Recommended):
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:
1. Run `npm run build`
2. Drag `.next` folder to Netlify

---

## 📄 License

© 2025 Karwan Auliya. Developed for Haseeb Ahmad.

For support, contact: your@email.com
