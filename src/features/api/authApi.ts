import { baseApi } from './baseApi';
import { ResultCode } from '@/common/enums/enums';
import type { LoginFormData, Response } from '@/common/types/types';

type MeResponseData = {
    id: number;
    email: string;
    login: string;
};

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        me: builder.query<boolean, void>({
            query: () => '/auth/me',
            transformResponse: (resp: Response<MeResponseData>) => {
                return resp.resultCode === ResultCode.Success;
            },
        }),
        login: builder.mutation<
            Response<{
                token: string;
                userId: number;
            }>,
            LoginFormData
        >({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<Response, void>({
            query: () => ({
                url: '/auth/login',
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi;
