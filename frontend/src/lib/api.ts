import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const authApi = {
    login: (data: any) => api.post('/auth/login', data).then(res => res.data),
    register: (data: any) => api.post('/auth/register', data).then(res => res.data),
    logout: () => api.post('/auth/logout').then(res => res.data),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }).then(res => res.data),
    resetPassword: (data: any) => api.post('/auth/reset-password', data).then(res => res.data),
    verifyResetToken: (token: string) => api.get(`/auth/verify-reset-token?token=${token}`).then(res => res.data),
};

export const dashboardApi = {
    getAdminStats: () => api.get('/dashboard/admin').then(res => res.data),
    getUserStats: (userId: string) => api.get(`/dashboard/user/${userId}`).then(res => res.data),
};

export const carApi = {
    list: () => api.get('/car').then(res => res.data),
    getOne: (id: string) => api.get(`/car/${id}`).then(res => res.data),
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
