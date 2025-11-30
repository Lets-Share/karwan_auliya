'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { getDriveDirectImageURL } from '@/lib/drive';

interface BookCardProps {
    id?: string;
    title: string;
    author: string;
    coverImageURL?: string;
    coverImageUrl?: string;
    averageRating?: number;
    totalReviews?: number;
    isFavorite?: boolean;
    onFavoriteToggle?: () => void;
}

export default function BookCard({
    id,
    title,
    author,
    coverImageURL,
    coverImageUrl,
    averageRating = 0,
    totalReviews = 0,
    isFavorite = false,
    onFavoriteToggle,
}: BookCardProps) {
    const rawImageUrl = coverImageUrl || coverImageURL;
    const imageUrl = rawImageUrl ? getDriveDirectImageURL(rawImageUrl) : null;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Link href={`/book/${id || ''}`} className="block h-full">
                <div className="group relative h-full flex flex-col">
                    {/* Book Cover with 3D effect */}
                    <div className="relative aspect-[2/3] rounded-r-lg rounded-l-sm shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20">
                        {/* Spine effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-white/20 to-transparent z-20 rounded-l-sm" />
                        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-black/10 z-20" />

                        <div className="absolute inset-0 bg-surface-light dark:bg-surface-dark rounded-r-lg rounded-l-sm overflow-hidden">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                                    <div className="text-4xl mb-2">📚</div>
                                    <p className="text-xs text-primary/60 font-medium line-clamp-3">{title}</p>
                                </div>
                            )}
                        </div>

                        {/* Favorite Button */}
                        {onFavoriteToggle && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onFavoriteToggle();
                                }}
                                className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30"
                            >
                                {isFavorite ? (
                                    <FaHeart className="text-red-500 text-sm" />
                                ) : (
                                    <FaRegHeart className="text-gray-600 dark:text-gray-400 text-sm" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="pt-4 px-1">
                        <h3 className="font-display font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{author}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                            </span>
                            {totalReviews > 0 && (
                                <span className="text-xs text-gray-400">({totalReviews})</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
