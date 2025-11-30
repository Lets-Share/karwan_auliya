'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CategoryChipProps {
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

export default function CategoryChip({ label, icon, active = false, onClick }: CategoryChipProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
        ${active
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
      `}
        >
            {icon && <span className="text-xl">{icon}</span>}
            <span>{label}</span>
        </motion.button>
    );
}
