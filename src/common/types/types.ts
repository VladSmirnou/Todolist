export type Respose<T = {}> = {
    resultCode: number;
    messages: Array<string>;
    fieldsErrors: Array<string>;
    data: T;
};

export type LoginFormData = {
    email: string;
    password: string;
    rememberMe?: boolean;
    captcha?: string;
};
