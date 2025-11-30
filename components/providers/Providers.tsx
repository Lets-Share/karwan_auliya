'use client';

import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NextThemeProvider>
    );
}
