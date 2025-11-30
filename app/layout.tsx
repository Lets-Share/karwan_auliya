import type { Metadata } from 'next';
import { Inter, Outfit, Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const notoNaskhArabic = Noto_Naskh_Arabic({
    subsets: ['arabic'],
    variable: '--font-arabic',
    weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
    title: 'Karwan Auliya - Digital Islamic & General Library',
    description: 'Access a curated library of Islamic literature, academic texts, and general reading materials',
    keywords: ['Islamic books', 'digital library', 'Karwan Auliya', 'PDF books', 'educational resources'],
    authors: [{ name: 'Haseeb Ahmad' }],
    manifest: '/manifest.json',
    themeColor: '#0B6E4F',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} ${notoNaskhArabic.variable} antialiased custom-scrollbar`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
