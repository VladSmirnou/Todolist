export type Response<T = {}> = {
    resultCode: number;
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
