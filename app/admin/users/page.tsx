'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaShieldAlt, FaUserShield } from 'react-icons/fa';
import { getUsers, updateUserRole } from '@/services/userService';
import type { UserData } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const allUsers = await getUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (uid: string, newRole: 'user' | 'admin') => {
        if (uid === currentUser?.uid) {
            alert("You cannot change your own role.");
            return;
        }

        setUpdating(uid);
        try {
            await updateUserRole(uid, newRole);
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-display font-bold text-4xl text-gray-900 dark:text-white mb-2">
                    Users
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage user roles and permissions ({users.length} users)
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((userData) => (
                                <motion.tr
                                    key={userData.uid}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white font-semibold">
                                                {userData.displayName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {userData.displayName || 'Unknown User'}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {userData.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${userData.role === 'admin'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {userData.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {userData.uid !== currentUser?.uid && (
                                            <button
                                                onClick={() => handleRoleUpdate(userData.uid, userData.role === 'admin' ? 'user' : 'admin')}
                                                disabled={updating === userData.uid}
                                                className={`p-2 rounded-lg transition-all ${userData.role === 'admin'
                                                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                        : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                                    }`}
                                                title={userData.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                            >
                                                {updating === userData.uid ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : userData.role === 'admin' ? (
                                                    <FaUserShield />
                                                ) : (
                                                    <FaShieldAlt />
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
