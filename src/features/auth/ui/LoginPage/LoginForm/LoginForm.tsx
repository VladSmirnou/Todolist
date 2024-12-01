import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { LoginFormData } from '@/common/types/types';
import { login } from '@/features/auth/model/authSlice';
import { SubmitHandler, useForm } from 'react-hook-form';

const defaultValues = {
    email: '',
    password: '',
    rememberMe: false,
};

export const LoginForm = () => {
    const dispatch = useAppDispatch();

    const { register, handleSubmit } = useForm<LoginFormData>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        dispatch(login(data));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('email')} />
            <input type="password" {...register('password')} />
            <input type="checkbox" {...register('rememberMe')} />
            <button>login</button>
        </form>
    );
};
