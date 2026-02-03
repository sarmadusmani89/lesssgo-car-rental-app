import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: (data: any) => api.post('/auth/login', data).then(res => res.data),
    register: (data: any) => api.post('/auth/register', data).then(res => res.data),
    logout: () => api.post('/auth/logout').then(res => res.data),
};

export const dashboardApi = {
    getAdminStats: () => api.get('/dashboard/admin').then(res => res.data),
    getUserStats: (userId: string) => api.get(`/dashboard/user/${userId}`).then(res => res.data),
};

export const vehicleApi = {
    list: () => api.get('/vehicle').then(res => res.data),
    getOne: (id: string) => api.get(`/vehicle/${id}`).then(res => res.data),
};

export const bookingApi = {
    create: (data: any) => api.post('/booking', data).then(res => res.data),
    list: () => api.get('/booking').then(res => res.data),
    getOne: (id: string) => api.get(`/booking/${id}`).then(res => res.data),
};

export const userApi = {
    profile: () => api.get('/user/profile').then(res => res.data),
    update: (data: any) => api.put('/user/profile', data).then(res => res.data),
};

export default api;
