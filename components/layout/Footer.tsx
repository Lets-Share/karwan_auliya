'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="text-3xl">📚</div>
                            <span className="font-display font-bold text-xl gradient-text">
                                Karwan Auliya
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Access a curated library of Islamic literature, academic texts, and general reading materials.
                            Read, learn, and grow with our digital library platform.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                <FaGithub size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/library" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Browse Library
                                </Link>
                            </li>
                            <li>
                                <Link href="/goals" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Reading Goals
                                </Link>
                            </li>
                            <li>
                                <Link href="/favorites" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    My Favorites
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Karwan Auliya. All rights reserved.
                    </p>

                    {/* Back to Top */}
                    <button
                        onClick={scrollToTop}
                        className="mt-4 sm:mt-0 flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                    >
                        <span className="text-sm font-medium">Back to top</span>
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </footer>
    );
}
