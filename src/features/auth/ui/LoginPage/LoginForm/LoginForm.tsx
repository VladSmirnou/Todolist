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

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm<LoginFormData>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        dispatch(login(data));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('email', { required: true })} />
            {errors.email && <p>{errors.email.message}</p>}
            <input
                type="password"
                {...register('password', { required: true, minLength: 4 })}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <input type="checkbox" {...register('rememberMe')} />
            <button disabled={!isDirty || !isValid}>login</button>
        </form>
    );
};
