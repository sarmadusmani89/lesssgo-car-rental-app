import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dashboardApi = {
    getAdminStats: () => api.get('/dashboard/admin').then(res => res.data),
    getUserStats: (userId: string) => api.get(`/dashboard/user/${userId}`).then(res => res.data),
};

export const vehicleApi = {
    list: () => api.get('/vehicles').then(res => res.data),
};

export default api;
