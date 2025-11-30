'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaBook, FaDownload } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Total Views', value: '0', change: '+0%', icon: FaChartLine, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Active Users', value: '0', change: '+0%', icon: FaUsers, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { label: 'Total Books', value: '0', change: '+0%', icon: FaBook, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { label: 'Total Downloads', value: '0', change: '+0%', icon: FaDownload, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    ]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            // Fetch users count
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnapshot.size;

            // Fetch books count and total downloads
            const booksSnapshot = await getDocs(collection(db, 'books'));
            const totalBooks = booksSnapshot.size;
            const totalDownloads = booksSnapshot.docs.reduce((sum, doc) => {
                return sum + (doc.data().downloads || 0);
            }, 0);

            // Calculate weekly active users (users created in last 7 days)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const activeUsers = usersSnapshot.docs.filter(doc => {
                const createdAt = doc.data().createdAt;
                if (!createdAt) return false;
                const createdDate = new Date(createdAt);
                return createdDate >= oneWeekAgo;
            }).length;

            // Update stats
            setStats([
                {
                    label: 'Total Views',
                    value: (totalDownloads * 3).toString(), // Estimate: 3 views per download
                    change: '+15%',
                    icon: FaChartLine,
                    color: 'text-blue-500',
                    bg: 'bg-blue-100 dark:bg-blue-900/30'
                },
                {
                    label: 'Active Users',
                    value: totalUsers.toString(),
                    change: activeUsers > 0 ? `+${Math.round((activeUsers / totalUsers) * 100)}%` : '+0%',
                    icon: FaUsers,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-100 dark:bg-emerald-900/30'
                },
                {
                    label: 'Total Books',
                    value: totalBooks.toString(),
                    change: '+0%',
                    icon: FaBook,
                    color: 'text-purple-500',
                    bg: 'bg-purple-100 dark:bg-purple-900/30'
                },
                {
                    label: 'Total Downloads',
                    value: totalDownloads.toString(),
                    change: '+12%',
                    icon: FaDownload,
                    color: 'text-orange-500',
                    bg: 'bg-orange-100 dark:bg-orange-900/30'
                },
            ]);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-2">
                    Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Overview of your library's performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="text-xl" />
                            </div>
                            <span className="text-sm font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section (Placeholder) */}
            <div className="grid lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">
                        User Growth
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">
                        Popular Categories
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Islamic Studies', value: 75, color: 'bg-emerald-500' },
                            { label: 'Fiction', value: 60, color: 'bg-purple-500' },
                            { label: 'Academic', value: 45, color: 'bg-blue-500' },
                            { label: 'History', value: 30, color: 'bg-orange-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
