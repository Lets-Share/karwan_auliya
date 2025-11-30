export function createBookSchema(book: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImageUrl?: string;
    averageRating: number;
    totalReviews: number;
    category: string;
    publishedDate?: string;
    pageCount?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Book',
        '@id': `https://karwan-auliya.vercel.app/book/${book.id}`,
        name: book.title,
        author: {
            '@type': 'Person',
            name: book.author,
        },
        description: book.description,
        image: book.coverImageUrl,
        aggregateRating: book.totalReviews > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: book.averageRating,
            reviewCount: book.totalReviews,
            bestRating: 5,
            worstRating: 1,
        } : undefined,
        genre: book.category,
        datePublished: book.publishedDate,
        numberOfPages: book.pageCount,
        inLanguage: ['en', 'ur', 'ar'],
    };
}

export function createOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Karwan Auliya',
        url: 'https://karwan-auliya.vercel.app',
        logo: 'https://karwan-auliya.vercel.app/logo.png',
        description: 'Digital Islamic & General Library - Access curated Islamic literature, academic texts, and reading materials',
        sameAs: [
            // Add social media links if available
        ],
    };
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function createReviewSchema(review: {
    id: string;
    bookId: string;
    userName: string;
    rating: number;
    reviewText: string;
    createdAt: Date;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        itemReviewed: {
            '@type': 'Book',
            '@id': `https://karwan-auliya.vercel.app/book/${review.bookId}`,
        },
        author: {
            '@type': 'Person',
            name: review.userName,
        },
        reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
        },
        reviewBody: review.reviewText,
        datePublished: review.createdAt.toISOString(),
    };
}
