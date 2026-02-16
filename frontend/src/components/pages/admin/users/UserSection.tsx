'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { useUsers } from '../../../../hooks/useUsers';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import { UserFilters } from './UserFilters';
import { Pagination } from '../../../ui/Pagination';
import { TableSkeleton } from '../../../ui/Skeletons';
import { toast } from 'sonner';
import { User, UserRole } from '../../../../types/user';

export default function UserSection() {
    const { users, isLoading, refreshUsers, deleteUser, updateUser } = useUsers();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUserId(JSON.parse(storedUser).id);
        }
    }, []);

    const itemsPerPage = 8;

    // Filter and Search Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());
            const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    // Pagination Logic
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshUsers();
            toast.success('User list synchronized');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (id === currentUserId) {
            toast.error("You cannot delete your own administrative account.");
            return;
        }

        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleUpdate = async (id: string, data: any) => {
        setIsSubmitting(true);
        try {
            await updateUser(id, data);
            toast.success('User updated successfully');
            setIsModalOpen(false);
            setEditingUser(null);
        } catch (err) {
            toast.error('Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && users.length === 0) {
        return <TableSkeleton rows={8} cols={5} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Control access, monitor verify statuses and manage system administrative roles.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 group"
                    >
                        <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    </button>
                </div>
            </div>

            {/* Controls Area */}
            <UserFilters
                search={search}
                onSearchChange={setSearch}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
            />

            {/* Content Area */}
            {filteredUsers.length > 0 ? (
                <>
                    <UserTable
                        users={paginatedUsers}
                        currentUserId={currentUserId}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Filter className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No users found</h3>
                    <p className="text-slate-500 mt-2 max-w-xs">
                        We couldn't find any users matching your current search or filter criteria.
                    </p>
                    <button
                        onClick={() => { setSearch(''); setRoleFilter('ALL'); }}
                        className="mt-6 text-blue-600 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
                user={editingUser}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
