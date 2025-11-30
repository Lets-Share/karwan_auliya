'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signInWithGoogle } = useAuth();

    // Password strength calculation
    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (pass.length >= 12) strength += 25;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const getStrengthColor = () => {
        if (passwordStrength < 50) return 'bg-red-500';
        if (passwordStrength < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };
    const getStrengthText = () => {
        if (passwordStrength < 50) return 'Weak';
        if (passwordStrength < 75) return 'Medium';
        return 'Strong';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: name,
                role: 'user',
                createdAt: new Date().toISOString(),
                favorites: [],
                readingGoals: []
            });

            router.push('/');
        } catch (err: any) {
            setError(err.message.replace('Firebase: ', '').replace('Error ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err) {
            setError('Failed to sign in with Google');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-3xl"
                />
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                    {/* Left side - Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="order-2 md:order-1"
                    >
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-10">
                            <div className="mb-8">
                                <h2 className="font-display font-bold text-3xl mb-2 text-gray-900 dark:text-white">
                                    Create Account
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Join thousands of readers in our community
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2"
                                        >
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-600 dark:text-gray-400">Password strength</span>
                                                <span className={`font-semibold ${passwordStrength >= 75 ? 'text-green-600 dark:text-green-400' : passwordStrength >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {getStrengthText()}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${passwordStrength}%` }}
                                                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <FaArrowRight className="text-sm" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                            </div>

                            {/* Google Sign In */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleSignIn}
                                className="w-full py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <FaGoogle className="text-lg" />
                                Continue with Google
                            </motion.button>

                            {/* Sign In Link */}
                            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>

                    {/* Right side - Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 md:order-2"
                    >
                        <div className="text-center md:text-left">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-8xl mb-6 flex justify-center md:justify-start"
                            >
                                🎯
                            </motion.div>
                            <h1 className="font-display font-bold text-5xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                Start Your Journey
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Join our reading community and unlock amazing features
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Unlimited access to our entire library',
                                    'Set and track personal reading goals',
                                    'Save your favorite books',
                                    'Read offline anytime, anywhere',
                                    'Join a community of readers',
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                            <FaCheckCircle className="text-white" />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
