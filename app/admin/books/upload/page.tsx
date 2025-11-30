'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUpload, FaImage, FaFilePdf, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { createBook } from '@/services/bookService';

export default function UploadBookPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: 'islamic-studies',
        language: 'urdu',
        coverImageUrl: '',
        pdfUrl: '',
        pdfFileName: '',
        pageCount: 0,
        publishedDate: '',
        tags: ''
    });

    const categories = [
        { value: 'hadith', label: 'Hadith' },
        { value: 'tafseer', label: 'Tafseer' },
        { value: 'fiqh', label: 'Fiqh' },
        { value: 'seerah', label: 'Seerah' },
        { value: 'aqeedah', label: 'Aqeedah' },
        { value: 'history', label: 'Islamic History' },
        { value: 'academic', label: 'Academic' },
        { value: 'fiction', label: 'Fiction' },
        { value: 'general', label: 'General' }
    ];

    const languages = [
        { value: 'urdu', label: 'Urdu' },
        { value: 'english', label: 'English' },
        { value: 'arabic', label: 'Arabic' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate URLs
            if (!formData.pdfUrl.trim() || !formData.coverImageUrl.trim()) {
                throw new Error('Please provide both PDF URL and Cover Image URL');
            }

            // Create book
            await createBook({
                title: formData.title,
                author: formData.author,
                description: formData.description,
                category: formData.category,
                language: formData.language,
                coverImageUrl: formData.coverImageUrl,
                pdfUrl: formData.pdfUrl,
                pdfFileName: formData.pdfFileName || `${formData.title}.pdf`,
                pageCount: formData.pageCount,
                publishedDate: formData.publishedDate,
                uploadedAt: new Date().toISOString(),
                downloads: 0,
                averageRating: 0,
                totalReviews: 0,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
            });

            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to upload book');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-4xl text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-2">
                        Book Uploaded!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Redirecting to dashboard...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-2">
                    Upload New Book
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Add a new book to your library using Google Drive links
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                {/* Instructions */}
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📌 How to upload:</h3>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>Upload your PDF to Google Drive</li>
                        <li>Right-click → Share → Change to "Anyone with the link"</li>
                        <li>Copy the share link and paste it in the PDF URL field below</li>
                        <li>Do the same for the cover image</li>
                    </ol>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Book Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="Enter book title"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Author *
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="Enter author name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
                            placeholder="Enter book description"
                            required
                        />
                    </div>

                    {/* Category and Language */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Language *
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                required
                            >
                                {languages.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* PDF URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FaFilePdf className="inline mr-2" />
                            PDF URL (Google Drive Link) *
                        </label>
                        <input
                            type="url"
                            name="pdfUrl"
                            value={formData.pdfUrl}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="https://drive.google.com/file/d/..."
                            required
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FaImage className="inline mr-2" />
                            Cover Image URL (Google Drive Link) *
                        </label>
                        <input
                            type="url"
                            name="coverImageUrl"
                            value={formData.coverImageUrl}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="https://drive.google.com/file/d/..."
                            required
                        />
                    </div>

                    {/* Optional Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Page Count (Optional)
                            </label>
                            <input
                                type="number"
                                name="pageCount"
                                value={formData.pageCount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                placeholder="500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Published Date (Optional)
                            </label>
                            <input
                                type="date"
                                name="publishedDate"
                                value={formData.publishedDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags (Optional, comma-separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                            placeholder="hadith, authentic, sahih"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FaUpload /> Upload Book
                                </>
                            )}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
