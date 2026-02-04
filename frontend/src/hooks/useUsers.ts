import useSWR from 'swr';
import { adminApi } from '../lib/api';
import { User, UserRole } from '../types/user';

export function useUsers() {
    const { data, error, mutate, isLoading } = useSWR<User[]>('/users', adminApi.listUsers, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    const createUser = async (userData: any) => {
        try {
            const newUser = await adminApi.createUser(userData);
            mutate([...(data || []), newUser], false);
            return newUser;
        } catch (err) {
            throw err;
        }
    };

    const updateUser = async (id: string, userData: any) => {
        try {
            const updatedUser = await adminApi.updateUser(id, userData);
            mutate(data?.map(u => (u.id === id ? updatedUser : u)), false);
            return updatedUser;
        } catch (err) {
            throw err;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await adminApi.deleteUser(id);
            mutate(data?.filter(u => u.id !== id), false);
        } catch (err) {
            throw err;
        }
    };

    return {
        users: data || [],
        isLoading,
        isError: error,
        createUser,
        updateUser,
        deleteUser,
        refreshUsers: mutate,
    };
}
