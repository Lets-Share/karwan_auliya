'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/ui/BookCard';
import CategoryChip from '@/components/ui/CategoryChip';
import { useAuth } from '@/context/AuthContext';
import { getBooks } from '@/services/bookService';
import type { Book } from '@/services/bookService';

const categories = [
    { label: 'All', value: 'all' },
    { label: 'Islamic Studies', value: 'islamic-studies', icon: '☪️' },
    { label: 'Academic', value: 'academic', icon: '🎓' },
    { label: 'Leisure & Fiction', value: 'leisure', icon: '📖' },
];

const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Most Reviewed', value: 'reviews' },
    { label: 'A-Z', value: 'alphabetical' },
];

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        filterAndSortBooks();
    }, [books, selectedCategory, sortBy, searchTerm]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const booksData = await getBooks();
            setBooks(booksData);
        } catch (error: any) {
            console.error('Error loading books:', error);
            setError(error.message || 'Failed to load books');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBooks = () => {
        let filtered = [...books];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(book => book.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                book =>
                    book.title.toLowerCase().includes(search) ||
                    book.author.toLowerCase().includes(search)
            );
        }

        // Sort
        switch (sortBy) {
            case 'rating':
                filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'reviews':
                filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'recent':
            default:
                filtered.sort((a, b) =>
                    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                );
        }

        setFilteredBooks(filtered);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display font-bold text-4xl md:text-5xl gradient-text mb-4">
                            Browse Library
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Explore our collection of {books.length}+ books across various categories
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Debug: Loaded {books.length} books. Showing {filteredBooks.length} books.
                            Category: {selectedCategory}. Search: "{searchTerm}".
                            {user ? ' | Auth: ✓ Logged In' : ' | Auth: ✗ Not Logged In'}
                            {error && ` | Error: ${error}`}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="card p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title or author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input pl-12 w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="input min-w-[180px]"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {categories.map(category => (
                            <CategoryChip
                                key={category.value}
                                label={category.label}
                                icon={category.icon}
                                active={selectedCategory === category.value}
                                onClick={() => setSelectedCategory(category.value)}
                            />
                        ))}
                    </div>

                    {/* Books Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
                    ) : filteredBooks.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        >
                            {filteredBooks.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="max-w-[180px] mx-auto w-full"
                                >
                                    <BookCard {...book} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h3 className="font-display font-semibold text-2xl mb-2 text-red-600 dark:text-red-400">Error Loading Books</h3>
                            <p className="text-red-500 dark:text-red-300">{error}</p>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="font-display font-semibold text-2xl mb-2">No books found</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {searchTerm
                                    ? `No results for "${searchTerm}". Try a different search term.`
                                    : 'No books available in this category.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
