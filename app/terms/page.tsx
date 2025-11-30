import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6 gradient-text">Terms of Service</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Welcome to Karwan Auliya. By accessing our website, you agree to these terms and conditions.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Service</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Our library is provided for educational and personal use. You agree not to misuse the services or content provided.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
