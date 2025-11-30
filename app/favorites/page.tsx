'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/ui/BookCard';
import { useAuth } from '@/context/AuthContext';
import { getUserFavorites, getBookById, removeFavorite } from '@/lib/db';
import { Book } from '@/types';

export default function FavoritesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        loadFavorites();
    }, [user]);

    const loadFavorites = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const favoriteIds = await getUserFavorites(user.uid);

            // Fetch book details for each favorite
            const booksPromises = favoriteIds.map(id => getBookById(id));
            const books = await Promise.all(booksPromises);

            setFavorites(books.filter(book => book !== null) as Book[]);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (bookId: string) => {
        if (!user) return;

        try {
            await removeFavorite(user.uid, bookId);
            setFavorites(favorites.filter(book => book.id !== bookId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display font-bold text-4xl md:text-5xl gradient-text mb-4">
                            My Library
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Your saved books and reading collection
                        </p>
                    </div>

                    {/* Favorites Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card overflow-hidden">
                                    <div className="h-64 skeleton"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-6 skeleton"></div>
                                        <div className="h-4 skeleton w-2/3"></div>
                                        <div className="h-4 skeleton w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : favorites.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {favorites.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <BookCard
                                        {...book}
                                        isFavorite={true}
                                        onFavoriteToggle={() => handleRemoveFavorite(book.id)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 card">
                            <div className="text-6xl mb-4">💔</div>
                            <h3 className="font-display font-semibold text-2xl mb-2">No favorites yet</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start adding books to your library to see them here
                            </p>
                            <button
                                onClick={() => router.push('/library')}
                                className="btn-primary"
                            >
                                Browse Library
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
