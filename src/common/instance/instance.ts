import axios from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL as string,
    headers: {
        'API-KEY': import.meta.env.VITE_API_KEY as string,
    },
});

instance.interceptors.request.use((config) => {
    config.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('authToken')}`,
    );
    return config;
});
