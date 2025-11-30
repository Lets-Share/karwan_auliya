# Karwan Auliya - Digital Library Platform

A modern, responsive web application for accessing Islamic literature, academic texts, and general reading materials.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
```bash
cd d:/library/karwan_auliya
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open in Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Features Implemented

### ✅ Core Infrastructure
- Next.js 14 with App Router
- TypeScript for type safety
- TailwindCSS with custom theme
- Firebase SDK integration
- Dark/Light theme support

### ✅ Authentication
- User registration with email/password
- Secure login system
- Password strength indicator
- Profile management
- Admin role support

### ✅ UI Components
- Premium Button component (multiple variants)
- BookCard with ratings and favorites
- CategoryChip for navigation
- Responsive Navbar with mobile menu
- Footer with links
- Glassmorphism effects
- Framer Motion animations

### ✅ Pages
- Home page with hero, stats, categories
- Login page
- Registration page
- Responsive design for all screen sizes

## 🔨 Currently Building

- Library/Browse page
- Book detail page
- PDF Reader
- Favorites system
- Reading goals
- Admin panel

## 🎨 Design Features

- **Premium UI**: Modern glassmorphism effects, gradients, smooth animations
- **Responsive**: Works on all devices (desktop, tablet, mobile)
- **Dark Mode**: Complete dark theme support
- **Accessible**: ARIA labels, keyboard navigation
- **Performance**: Optimized images, code splitting, lazy loading

## 🔧 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS + Custom CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State**: React Context + Zustand
- **Animations**: Framer Motion
- **PDF Viewer**: react-pdf
- **Icons**: React Icons

## 📝 Environment Setup

Create a `.env.local` file with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🚢 Building for Production

```bash
npm run build
npm run start
```

## 📱 PWA & APK Conversion

This web app can be converted to a mobile APK using:

### Option 1: Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android
```

### Option 2: PWA Builder
Visit [pwabuilder.com](https://www.pwabuilder.com) and enter your deployed URL

## 📄 License

© 2025 Karwan Auliya. All rights reserved.
