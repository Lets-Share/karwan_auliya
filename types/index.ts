export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    category: 'Islamic Studies' | 'Academic' | 'Leisure';
    subcategory?: string;
    coverImageURL?: string;
    pdfURL: string;
    averageRating: number;
    totalReviews: number;
    uploadedAt: Date;
}

export interface Review {
    id: string;
    bookId: string;
    userId: string;
    userName: string;
    userPhotoURL?: string;
    rating: number;
    reviewText: string;
    isApproved: boolean;
    createdAt: Date;
}

export interface ReadingProgress {
    id: string;
    userId: string;
    bookId: string;
    lastPage: number;
    totalPages: number;
    lastReadAt: Date;
    timeSpent: number; // in seconds
}

export interface ReadingGoal {
    id: string;
    userId: string;
    type: 'books' | 'pages';
    target: number;
    current: number;
    period: 'weekly' | 'monthly';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface Favorite {
    id: string;
    userId: string;
    bookId: string;
    addedAt: Date;
}
