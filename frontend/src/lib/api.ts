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

// Response interceptor for handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if we're already on an auth page or the request is for auth
            const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');

            if (typeof window !== 'undefined' && !isAuthRequest) {
                // Clear all auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                // Redirect to login
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

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

export const adminApi = {
    // Users
    listUsers: () => api.get('/users').then(res => res.data),
    createUser: (data: any) => api.post('/users', data).then(res => res.data),
    updateUser: (id: string, data: any) => api.put(`/users/${id}`, data).then(res => res.data),
    deleteUser: (id: string) => api.delete(`/users/${id}`).then(res => res.data),

    // Bookings (Admin management)
    listBookings: () => api.get('/booking').then(res => res.data),
    updateBooking: (id: string, data: any) => api.put(`/booking/${id}`, data).then(res => res.data),
    deleteBooking: (id: string) => api.delete(`/booking/${id}`).then(res => res.data),
};

export const newsletterApi = {
    subscribe: (email: string) => api.post('/newsletter/subscribe', { email }).then(res => res.data),
};


export default api;
