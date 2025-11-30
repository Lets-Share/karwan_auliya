'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBullseye, FaBook, FaFileAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { getActiveGoal, createGoal } from '@/lib/db';
import { ReadingGoal } from '@/types';
import { format, differenceInDays } from 'date-fns';

export default function GoalsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeGoal, setActiveGoal] = useState<ReadingGoal | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'books' as 'books' | 'pages',
        target: 5,
        period: 'monthly' as 'weekly' | 'monthly',
    });
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        loadActiveGoal();
    }, [user]);

    const loadActiveGoal = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const goal = await getActiveGoal(user.uid);
            setActiveGoal(goal);
        } catch (error) {
            console.error('Error loading goal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setCreating(true);
            await createGoal(user.uid, formData.type, formData.target, formData.period);
            await loadActiveGoal();
            setShowCreateForm(false);
            setFormData({ type: 'books', target: 5, period: 'monthly' });
        } catch (error) {
            console.error('Error creating goal:', error);
        } finally {
            setCreating(false);
        }
    };

    const progress = activeGoal
        ? Math.min(100, (activeGoal.current / activeGoal.target) * 100)
        : 0;

    const daysRemaining = activeGoal
        ? Math.max(0, differenceInDays(activeGoal.endDate, new Date()))
        : 0;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-display font-bold text-4xl md:text-5xl gradient-text mb-4">
                            Reading Goals
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Track your reading progress and stay motivated
                        </p>
                    </div>

                    {loading ? (
                        <div className="card p-12">
                            <div className="h-40 skeleton mb-4"></div>
                            <div className="h-6 skeleton w-1/2 mb-2"></div>
                            <div className="h-4 skeleton w-1/3"></div>
                        </div>
                    ) : activeGoal ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-8 mb-8"
                        >
                            {/* Goal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-display font-bold text-2xl mb-1">
                                        {activeGoal.period === 'weekly' ? 'Weekly' : 'Monthly'} Goal
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {format(activeGoal.startDate, 'MMM d')} - {format(activeGoal.endDate, 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">{daysRemaining}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">days left</p>
                                </div>
                            </div>

                            {/* Progress Circle */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative w-48 h-48 mb-4">
                                    <svg className="transform -rotate-90 w-full h-full">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-gray-200 dark:text-gray-700"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 88}`}
                                            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                                            className="text-primary transition-all duration-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-4xl font-bold">{Math.round(progress)}%</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-1">
                                        {activeGoal.current} / {activeGoal.target}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {activeGoal.type === 'books' ? 'Books Read' : 'Pages Read'}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <p className="text-2xl font-bold text-primary mb-1">
                                        {activeGoal.target - activeGoal.current}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <p className="text-2xl font-bold text-primary mb-1">
                                        {daysRemaining > 0
                                            ? Math.ceil((activeGoal.target - activeGoal.current) / daysRemaining)
                                            : 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Per Day</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="card p-12 text-center mb-8">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="font-display font-semibold text-2xl mb-2">No active goal</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Set a reading goal to track your progress
                            </p>
                            <Button icon={<FaPlus />} onClick={() => setShowCreateForm(true)}>
                                Create Goal
                            </Button>
                        </div>
                    )}

                    {/* Create Goal Form */}
                    {showCreateForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-8"
                        >
                            <h3 className="font-display font-semibold text-2xl mb-6">Create New Goal</h3>

                            <form onSubmit={handleCreateGoal} className="space-y-6">
                                {/* Goal Type */}
                                <div>
                                    <label className="block text-sm font-medium mb-3">What do you want to track?</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'books' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'books'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <FaBook className="text-3xl mb-2 mx-auto" />
                                            <p className="font-semibold">Books</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'pages' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'pages'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <FaFileAlt className="text-3xl mb-2 mx-auto" />
                                            <p className="font-semibold">Pages</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Target */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.target}
                                        onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                                        className="input"
                                        placeholder="Enter target number"
                                        required
                                    />
                                </div>

                                {/* Period */}
                                <div>
                                    <label className="block text-sm font-medium mb-3">Time Period</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, period: 'weekly' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.period === 'weekly'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <p className="font-semibold">Weekly</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, period: 'monthly' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.period === 'monthly'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <p className="font-semibold">Monthly</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <Button type="submit" loading={creating} fullWidth>
                                        Create Goal
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowCreateForm(false)}
                                        fullWidth
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
