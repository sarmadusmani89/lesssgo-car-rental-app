import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { SearchBar } from '../../../ui/SearchBar';
import { UserRole } from '../../../../types/user';

interface UserFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    roleFilter: UserRole | 'ALL';
    onRoleFilterChange: (role: UserRole | 'ALL') => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
}) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <SearchBar
                value={search}
                onChange={onSearchChange}
                placeholder="Search by name, email..."
            />

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter size={18} className="text-slate-400" />
                <div className="relative flex-1 md:flex-none">
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value as any)}
                        className="w-full appearance-none bg-slate-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                    >
                        <option value="ALL">All Roles</option>
                        <option value={UserRole.ADMIN}>Admin Only</option>
                        <option value={UserRole.USER}>User Only</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};
