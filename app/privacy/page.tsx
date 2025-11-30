import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6 gradient-text">Privacy Policy</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We collect information you provide directly to us, such as when you create an account, update your profile, or contact us.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
