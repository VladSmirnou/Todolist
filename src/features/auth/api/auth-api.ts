import { instance } from '@/common/instance/instance';
import type { LoginFormData, Respose } from '@/common/types/types';

type MeResponseData = {
    id: number;
    email: string;
    login: string;
};

export const authApi = {
    me() {
        return instance.get<Respose<MeResponseData>>('/auth/me');
    },
    login(data: LoginFormData) {
        return instance.post<
            Respose<{
                token: string;
                userId: number;
            }>
        >('/auth/login', data);
    },
    logout() {
        return instance.delete<Respose>('/auth/login');
    },
};
