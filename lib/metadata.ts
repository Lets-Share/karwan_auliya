import { Metadata } from 'next';

const siteConfig = {
    name: 'Karwan Auliya',
    description: 'Access a curated library of Islamic literature, academic texts, and general reading materials. Read, learn, and grow with our digital library platform.',
    url: 'https://karwan-auliya.vercel.app', // Will be updated after deployment
    ogImage: '/og-image.png',
    creator: 'Haseeb Ahmad',
    keywords: ['Islamic books', 'digital library', 'Karwan Auliya', 'PDF books', 'educational resources', 'Islamic literature', 'Urdu books', 'Arabic books'],
};

export function createMetadata({
    title,
    description,
    image,
    noIndex = false,
    path = '',
}: {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    path?: string;
}): Metadata {
    const pageTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
    const pageDescription = description || siteConfig.description;
    const pageImage = image || siteConfig.ogImage;
    const url = `${siteConfig.url}${path}`;

    return {
        title: pageTitle,
        description: pageDescription,
        keywords: siteConfig.keywords,
        authors: [{ name: siteConfig.creator }],
        creator: siteConfig.creator,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url,
            title: pageTitle,
            description: pageDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: pageImage,
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: pageDescription,
            images: [pageImage],
            creator: '@karwanauliya',
        },
        robots: noIndex ? {
            index: false,
            follow: false,
        } : {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: url,
        },
    };
}

export function createBookMetadata(book: {
    title: string;
    author: string;
    description: string;
    coverImageUrl?: string;
    category: string;
    id: string;
}): Metadata {
    return {
        ...createMetadata({
            title: book.title,
            description: `${book.description.slice(0, 150)}... by ${book.author}`,
            image: book.coverImageUrl,
            path: `/book/${book.id}`,
        }),
        keywords: [
            ...siteConfig.keywords,
            book.title,
            book.author,
            book.category,
            'book',
            'read online',
            'download PDF',
        ],
    };
}

export { siteConfig };
