import axios from 'axios';

const API_URL = 'http://localhost:3001';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const api = {
    get: <T = any>(url: string, config?: any) => axiosInstance.get<T>(url, config) as Promise<T>,
    post: <T = any>(url: string, data?: any, config?: any) => axiosInstance.post<T>(url, data, config) as Promise<T>,
    put: <T = any>(url: string, data?: any, config?: any) => axiosInstance.put<T>(url, data, config) as Promise<T>,
    delete: <T = any>(url: string, config?: any) => axiosInstance.delete<T>(url, config) as Promise<T>,
};
