'use client';

import React from 'react';
import { User, UserRole } from '../../../../types/user';
import { StatusBadge } from '../../../ui/StatusBadge';
import { Mail, MoreHorizontal, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-medium">
                            <th className="px-6 py-4 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 uppercase tracking-wider text-center">Role</th>
                            <th className="px-6 py-4 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AnimatePresence mode="popLayout">
                            {users.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-100 group-hover:scale-110 transition-transform">
                                                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{user.name || 'N/A'}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={user.role} type="role" />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.isVerified
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-500 font-medium italic">
                                            {new Date(user.createdAt).toLocaleDateString('en-AU', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="group-hover:hidden">
                                            <MoreHorizontal size={18} className="text-slate-300 ml-auto" />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
