'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatCardProps {
    icon: IconType;
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}

export default function StatCard({ icon: Icon, label, value, change, changeType = 'neutral' }: StatCardProps) {
    const changeColors = {
        positive: 'text-green-600 dark:text-green-400',
        negative: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                    <Icon className="text-2xl" />
                </div>
                {change && (
                    <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
                        {change}
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                {label}
            </p>
        </motion.div>
    );
}
