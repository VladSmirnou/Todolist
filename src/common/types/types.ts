import { ResultCode } from '../enums/enums';

export type Response<T = {}> = {
    resultCode: ResultCode;
    messages: Array<string>;
    fieldsErrors: Array<{ field: string; error: string }>;
    data: T;
};

export type LoginFormData = {
    email: string;
    password: string;
    rememberMe?: boolean;
    captcha?: string;
};

export type TaskIdParams = {
    taskId: string;
};
