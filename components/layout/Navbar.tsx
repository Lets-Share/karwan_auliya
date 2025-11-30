'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import Button from '@/components/ui/Button';

export default function Navbar() {
    const { user, userData, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/library', label: 'Library' },
        { href: '/goals', label: 'Goals' },
        { href: '/favorites', label: 'Favorites' },
    ];

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="text-3xl">📚</div>
                        <span className="font-display font-bold text-xl gradient-text hidden sm:block">
                            Karwan Auliya
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === link.href
                                    ? 'text-primary bg-primary/10'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Search Icon */}
                        {/* Search Bar */}
                        <div className="relative hidden sm:block">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const input = form.elements.namedItem('search') as HTMLInputElement;
                                    if (input.value.trim()) {
                                        window.location.href = `/library?search=${encodeURIComponent(input.value)}`;
                                    }
                                }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search books..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900 transition-all"
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </form>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <FaSun className="text-yellow-500" />
                            ) : (
                                <FaMoon className="text-gray-600" />
                            )}
                        </button>

                        {/* User Menu / Auth Buttons */}
                        {user ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                                    >
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        {userData?.isAdmin && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 rounded-lg font-medium ${pathname === link.href
                                    ? 'text-primary bg-primary/10'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                {userData?.isAdmin && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="block px-4 py-2 text-gray-700 dark:text-gray-300"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="px-4 py-2 space-y-2">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" size="sm" fullWidth>Login</Button>
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" size="sm" fullWidth>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </nav>
    );
}
