import { instance } from '@/common/instance/instance';
import type { LoginFormData, Response } from '@/common/types/types';

type MeResponseData = {
    id: number;
    email: string;
    login: string;
};

export const authApi = {
    me() {
        return instance.get<Response<MeResponseData>>('/auth/me');
    },
    login(data: LoginFormData) {
        return instance.post<
            Response<{
                token: string;
                userId: number;
            }>
        >('/auth/login', data);
    },
    logout() {
        return instance.delete<Response>('/auth/login');
    },
};
