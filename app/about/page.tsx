import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6 gradient-text">About Karwan Auliya</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Karwan Auliya is dedicated to preserving and sharing knowledge. Our mission is to provide easy access to a vast collection of Islamic literature, academic resources, and general reading materials.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        We believe in the power of reading to transform lives and communities. Our digital library is designed to be accessible, user-friendly, and comprehensive.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
