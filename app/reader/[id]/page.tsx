'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { getBookById, saveReadingProgress, getReadingProgress } from '@/lib/db';
import { getDriveEmbedURL } from '@/lib/drive';
import { Book } from '@/types';

export default function PDFReaderPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadBook();
    }, [bookId]);

    const loadBook = async () => {
        try {
            const bookData = await getBookById(bookId);
            if (!bookData) {
                router.push('/library');
                return;
            }
            setBook(bookData);

            // Note: With Google Drive embed, we can't easily track specific page numbers
            // automatically like we did with react-pdf. We'll just track that they opened it.
            if (user) {
                await saveReadingProgress(user.uid, bookId, 1, 1); // Mark as started
            }
        } catch (error) {
            console.error('Error loading book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (book?.pdfURL) {
            window.open(book.pdfURL, '_blank');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <p className="text-gray-600 dark:text-gray-400">Loading Book...</p>
                </div>
            </div>
        );
    }

    if (!book) return null;

    const embedUrl = getDriveEmbedURL(book.pdfURL);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col"
        >
            {/* Toolbar */}
            <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="font-semibold text-lg line-clamp-1">{book.title}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Download */}
                    {user && (
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Download PDF"
                        >
                            <FaDownload />
                        </button>
                    )}

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>

            {/* PDF Viewer (Google Drive Embed) */}
            <div className="flex-1 w-full h-full bg-gray-200 dark:bg-gray-800 relative">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full absolute inset-0 border-0"
                        allow="autoplay"
                        title={book.title}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8">
                            <div className="text-5xl mb-4">⚠️</div>
                            <p className="text-lg font-semibold mb-2">Cannot preview this file</p>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                The Google Drive link might be invalid or restricted.
                            </p>
                            <button onClick={handleDownload} className="btn-primary">
                                Open in Google Drive
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
