export function getDriveEmbedURL(url: string): string | null {
    if (!url) return null;

    // Handle standard view URLs
    // https://drive.google.com/file/d/FILE_ID/view
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (viewMatch && viewMatch[1]) {
        return `https://drive.google.com/file/d/${viewMatch[1]}/preview`;
    }

    // Handle ID-based URLs
    // https://drive.google.com/open?id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    // If it's already a preview URL, return as is
    if (url.includes('/preview')) {
        return url;
    }

    return null;
}

export function getDriveDownloadURL(url: string): string {
    // However, the user asked to be "redirected to google drive", so the original link is fine.
    return url;
}

export function getDriveDirectImageURL(url: string): string | null {
    if (!url) return null;

    // Extract ID from various Drive URL formats
    let id = '';

    // Match /file/d/ID/view
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (viewMatch && viewMatch[1]) {
        id = viewMatch[1];
    }
    // Match ?id=ID
    else {
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            id = idMatch[1];
        }
    }

    if (id) {
        // Use lh3.googleusercontent.com for direct image access which works well with Next.js Image
        return `https://lh3.googleusercontent.com/d/${id}`;
    }

    return url;
}
