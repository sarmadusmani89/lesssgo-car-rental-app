import React from 'react';
import { Filter } from 'lucide-react';
import { SearchBar } from '../../../ui/SearchBar';
import CustomSelect from '@/components/ui/CustomSelect';
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
                <CustomSelect
                    options={[
                        { label: 'All Roles', value: 'ALL' },
                        { label: 'Admin Only', value: UserRole.ADMIN },
                        { label: 'User Only', value: UserRole.USER },
                    ]}
                    value={roleFilter}
                    onChange={(val) => onRoleFilterChange(val as UserRole | 'ALL')}
                    className="w-[160px]"
                />
            </div>
        </div>
    );
};
