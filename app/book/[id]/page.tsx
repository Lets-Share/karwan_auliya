'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaDownload, FaHeart, FaRegHeart, FaBookOpen } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getBookById, getBooks, type Book } from '@/services/bookService';
import { getBookReviews, addReview, isFavorite, addFavorite, removeFavorite } from '@/lib/db';
import { Review } from '@/types';
import { formatDistance } from 'date-fns';
import { getDriveDirectImageURL } from '@/lib/drive';
import BookCard from '@/components/ui/BookCard';

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, text: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        loadBookData();
    }, [bookId]);

    const loadBookData = async () => {
        try {
            setLoading(true);
            const bookData = await getBookById(bookId);
            if (!bookData) {
                router.push('/library');
                return;
            }
            setBook(bookData);

            const reviewsData = await getBookReviews(bookId);
            setReviews(reviewsData);

            if (user) {
                const isFav = await isFavorite(user.uid, bookId);
                setFavorite(isFav);
            }

            // Load related books
            const allBooks = await getBooks();
            const related = allBooks
                .filter(b => b.category === bookData.category && b.id !== bookId)
                .slice(0, 4);
            setRelatedBooks(related);
        } catch (error) {
            console.error('Error loading book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            if (favorite) {
                await removeFavorite(user.uid, bookId);
                setFavorite(false);
            } else {
                await addFavorite(user.uid, bookId);
                setFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDownload = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (book?.pdfUrl) {
            window.open(book.pdfUrl, '_blank');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            setSubmittingReview(true);
            await addReview(
                bookId,
                user.uid,
                user.displayName || 'Anonymous',
                reviewData.rating,
                reviewData.text
            );
            setShowReviewForm(false);
            setReviewData({ rating: 5, text: '' });
            // Reload reviews
            const updatedReviews = await getBookReviews(bookId);
            setReviews(updatedReviews);
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">📚</div>
                        <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Book Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-3 gap-8 mb-12"
                    >
                        {/* Book Cover */}
                        <div className="md:col-span-1">
                            <div className="card overflow-hidden sticky top-24">
                                <div className="relative aspect-[2/3] w-full bg-gradient-to-br from-primary/20 to-primary-light/20">
                                    {book.coverImageUrl ? (
                                        <img
                                            src={getDriveDirectImageURL(book.coverImageUrl) || ''}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Image load error:', book.coverImageUrl);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl">
                                            📚
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="md:col-span-2">
                            <div className="mb-4">
                                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {book.category}
                                </span>
                            </div>

                            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">{book.title}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">by {book.author}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FaStar
                                            key={star}
                                            className={`text-2xl ${star <= Math.round(book.averageRating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{book.averageRating.toFixed(1)}/5.0</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {book.totalReviews} {book.totalReviews === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="font-display font-semibold text-2xl mb-3">About this book</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {book.description}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">

                                {user && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            icon={<FaDownload />}
                                            onClick={handleDownload}
                                        >
                                            Download PDF
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="lg"
                                            icon={favorite ? <FaHeart /> : <FaRegHeart />}
                                            onClick={handleFavoriteToggle}
                                        >
                                            {favorite ? 'Saved' : 'Save to Library'}
                                        </Button>
                                    </>
                                )}

                                {!user && (
                                    <Link href="/login">
                                        <Button variant="outline" size="lg">
                                            Login to Download
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Reviews Section */}
                    <section className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display font-bold text-3xl">Reviews</h2>
                            {user && !showReviewForm && (
                                <Button onClick={() => setShowReviewForm(true)}>
                                    Write a Review
                                </Button>
                            )}
                        </div>

                        {/* Review Form */}
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="card p-6 mb-6"
                            >
                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Your Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                    className="text-3xl transition-colors"
                                                >
                                                    <FaStar
                                                        className={star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Your Review</label>
                                        <textarea
                                            value={reviewData.text}
                                            onChange={(e) => setReviewData({ ...reviewData, text: e.target.value })}
                                            className="input min-h-[120px] resize-y"
                                            placeholder="Share your thoughts about this book..."
                                            maxLength={1000}
                                            required
                                        />
                                        <p className="text-sm text-gray-500 mt-1">{reviewData.text.length}/1000</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" loading={submittingReview}>
                                            Submit Review
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowReviewForm(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="card p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-semibold text-lg">
                                                {review.userName[0]?.toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold">{review.userName}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDistance(review.createdAt, new Date(), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-3">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <FaStar
                                                            key={star}
                                                            className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">{review.reviewText}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 card">
                                    <div className="text-5xl mb-3">💭</div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        No reviews yet. Be the first to review this book!
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Related Books Suggestions */}
                    <section className="mb-12">
                        <h2 className="font-display font-bold text-3xl mb-6">You May Also Like</h2>
                        {relatedBooks.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {relatedBooks.map((relatedBook, index) => (
                                    <motion.div
                                        key={relatedBook.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="max-w-[180px] mx-auto w-full"
                                    >
                                        <BookCard {...relatedBook} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 card">
                                <div className="text-5xl mb-3">📚</div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    No related books available at the moment.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
