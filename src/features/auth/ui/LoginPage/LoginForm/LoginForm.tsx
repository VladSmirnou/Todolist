import { SubmitHandler, useForm } from 'react-hook-form';

type FormFields = {
    username: string;
    password: string;
    rememberMe: boolean;
};

const defaultValues = {
    username: '',
    password: '',
    rememberMe: false,
};

export const LoginForm = () => {
    const { register, handleSubmit } = useForm<FormFields>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('username')} />
            <input type="text" {...register('password')} />
            <input type="checkbox" {...register('rememberMe')} />
            <button>login</button>
        </form>
    );
};
