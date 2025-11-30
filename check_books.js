
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkBooks() {
    console.log('Checking books in Firestore...');
    try {
        const snapshot = await getDocs(collection(db, 'books'));
        console.log(`Found ${snapshot.size} books.`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- ${doc.id}: ${data.title}`);
            console.log(`  category: ${data.category}`);
            console.log(`  uploadedAt: ${data.uploadedAt} (${typeof data.uploadedAt})`);
            console.log(`  averageRating: ${data.averageRating} (${typeof data.averageRating})`);
        });
    } catch (error) {
        console.error('Error fetching books:', error.code, error.message);
    }
}

checkBooks();
