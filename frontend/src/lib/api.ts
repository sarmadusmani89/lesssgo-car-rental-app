import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://134.199.169.242',
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
            const isAuthRequest = error.config?.url?.includes('/auth/login') ||
                error.config?.url?.includes('/auth/signup') ||
                error.config?.url?.includes('/auth/register');

            if (typeof window !== 'undefined' && !isAuthRequest) {
                // Clear all auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                // Dispatch custom event for same-tab components to update (like Header)
                window.dispatchEvent(new Event('auth-logout'));

                // Define protected routes that require redirect
                const protectedPaths = ['/dashboard', '/admin', '/checkout', '/profile', '/my-bookings'];
                const currentPath = window.location.pathname;
                const isProtectedRoute = protectedPaths.some(path => currentPath.startsWith(path));

                if (isProtectedRoute) {
                    // Redirect to login only if on a protected route
                    window.location.href = '/auth/login?redirect=' + encodeURIComponent(currentPath);
                }
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
    confirmPayment: (id: string) => api.patch(`/booking/${id}/confirm-payment`).then(res => res.data),

    // Testimonials
    listTestimonials: () => api.get('/testimonials').then(res => res.data),
    createTestimonial: (data: any) => api.post('/testimonials', data).then(res => res.data),
    updateTestimonial: (id: string, data: any) => api.patch(`/testimonials/${id}`, data).then(res => res.data),
    deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`).then(res => res.data),
};

export const newsletterApi = {
    subscribe: (email: string) => api.post('/newsletter/subscribe', { email }).then(res => res.data),
};


export default api;
