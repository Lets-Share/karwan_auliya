'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBook, FaUsers, FaDownload, FaStar, FaPlus, FaArrowRight } from 'react-icons/fa';
import StatCard from '@/components/admin/StatCard';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalDownloads: 0,
        averageRating: 0
    });
    const [recentBooks, setRecentBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Get total books
            const booksSnapshot = await getDocs(collection(db, 'books'));
            const books = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Get total users  
            const usersSnapshot = await getDocs(collection(db, 'users'));

            // Calculate stats
            const totalDownloads = books.reduce((sum: number, book: any) => sum + (book.downloads || 0), 0);
            const ratings = books.filter((book: any) => book.averageRating > 0);
            const avgRating = ratings.length > 0
                ? (ratings.reduce((sum: number, book: any) => sum + book.averageRating, 0) / ratings.length).toFixed(1)
                : 0;

            setStats({
                totalBooks: books.length,
                totalUsers: usersSnapshot.size,
                totalDownloads,
                averageRating: Number(avgRating)
            });

            // Get recent books
            const recentBooksQuery = query(
                collection(db, 'books'),
                orderBy('uploadedAt', 'desc'),
                limit(5)
            );
            const recentSnapshot = await getDocs(recentBooksQuery);
            const recent = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentBooks(recent);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome back! Here's what's happening with your library.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={FaBook}
                    label="Total Books"
                    value={stats.totalBooks}
                    change="+12 this month"
                    changeType="positive"
                />
                <StatCard
                    icon={FaUsers}
                    label="Total Users"
                    value={stats.totalUsers}
                    change="+23 this month"
                    changeType="positive"
                />
                <StatCard
                    icon={FaDownload}
                    label="Total Downloads"
                    value={stats.totalDownloads}
                    change="+156 this week"
                    changeType="positive"
                />
                <StatCard
                    icon={FaStar}
                    label="Avg Rating"
                    value={stats.averageRating || 'N/A'}
                    change={stats.averageRating > 0 ? `${stats.averageRating}/5.0` : undefined}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-bold text-2xl mb-2">Upload New Book</h3>
                            <p className="text-emerald-100 mb-4">Add books to your library</p>
                            <Link
                                href="/admin/books/upload"
                                className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
                            >
                                <FaPlus /> Upload Book
                            </Link>
                        </div>
                        <div className="text-6xl opacity-20">📚</div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-bold text-2xl mb-2 text-gray-900 dark:text-white">
                                Manage Books
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Edit and organize your collection
                            </p>
                            <Link
                                href="/admin/books"
                                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                            >
                                View All <FaArrowRight />
                            </Link>
                        </div>
                        <div className="text-6xl opacity-20">📖</div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Books */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                        Recent Uploads
                    </h2>
                    <Link
                        href="/admin/books"
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
                    >
                        View All →
                    </Link>
                </div>

                {recentBooks.length > 0 ? (
                    <div className="space-y-4">
                        {recentBooks.map((book) => (
                            <div
                                key={book.id}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <div className="w-12 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded flex items-center justify-center text-2xl">
                                    📕
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {book.author} • {book.category}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {book.downloads || 0} downloads
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(book.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-gray-600 dark:text-gray-400">No books uploaded yet</p>
                        <Link
                            href="/admin/books/upload"
                            className="inline-block mt-4 text-emerald-600 dark:text-emerald-400 font-semibold"
                        >
                            Upload your first book →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
