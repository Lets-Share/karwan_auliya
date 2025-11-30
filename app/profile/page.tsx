'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUser, FaCamera, FaSave } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, userData, refreshUserData } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        photoURL: ''
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (userData) {
            setFormData({
                displayName: userData.displayName || user.displayName || '',
                bio: userData.bio || '',
                photoURL: userData.photoURL || user.photoURL || ''
            });
        }
    }, [user, userData, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file.' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image must be less than 5MB.' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            // Create storage reference
            const storageRef = ref(storage, `profile_images/${user.uid}`);

            // Upload file
            await uploadBytes(storageRef, file);

            // Get download URL
            const photoURL = await getDownloadURL(storageRef);

            // Update form data
            setFormData({ ...formData, photoURL });

            setMessage({ type: 'success', text: 'Image uploaded! Click Save to update your profile.' });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (!user) throw new Error('No user logged in');

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                bio: formData.bio,
                photoURL: formData.photoURL
            });

            // Refresh user data in context
            await refreshUserData();

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 gradient-text">Edit Profile</h1>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 mb-4">
                                {formData.photoURL ? (
                                    <img
                                        src={formData.photoURL}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-4xl font-bold border-4 border-primary/20">
                                        {formData.displayName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="profile-image-input"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('profile-image-input')?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FaCamera size={16} />
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Profile Image URL
                                </label>
                                <input
                                    type="text"
                                    name="photoURL"
                                    value={formData.photoURL}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <FaSave /> Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
