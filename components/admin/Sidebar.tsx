'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaTachometerAlt,
    FaBook,
    FaUpload,
    FaUsers,
    FaChartLine,
    FaCog,
    FaTimes,
    FaBars,
    FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const menuItems = [
        { icon: FaTachometerAlt, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: FaBook, label: 'All Books', href: '/admin/books' },
        { icon: FaUpload, label: 'Upload Book', href: '/admin/books/upload' },
        { icon: FaUsers, label: 'Users', href: '/admin/users' },
        { icon: FaChartLine, label: 'Analytics', href: '/admin/analytics' },
        { icon: FaCog, label: 'Settings', href: '/admin/settings' },
    ];

    const handleSignOut = async () => {
        await signOut();
    };

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-emerald-600 text-white rounded-xl shadow-lg"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="text-3xl">📚</div>
                            <div>
                                <h1 className="font-display font-bold text-xl gradient-text">
                                    Admin Panel
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Karwan Auliya
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* User info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                                {user?.displayName?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user?.displayName || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                        ${isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <Icon className="text-lg" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                        >
                            <FaTachometerAlt className="text-lg" />
                            <span className="font-medium">View Site</span>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                            <FaSignOutAlt className="text-lg" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
