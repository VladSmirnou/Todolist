import { AUTH_TOKEN_KEY } from '@/common/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL as string,
        prepareHeaders: (headers) => {
            headers.set('API-KEY', import.meta.env.VITE_API_KEY as string);
            headers.set(
                'Authorization',
                `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
            );
        },
    }),
    endpoints: () => ({}),
});
