import { selectAppStatus } from '@/app/appSlice';
import { useAppDispatch } from '@/common/hooks/useAppDispatch';
import { useAppSelector } from '@/common/hooks/useAppSelector';
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
    const appStatus = useAppSelector(selectAppStatus);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        setError,
    } = useForm<LoginFormData>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        dispatch(login(data))
            .unwrap()
            .catch(
                (
                    err: Array<{
                        field: keyof LoginFormData;
                        error: string;
                    }>,
                ) => {
                    err.forEach(({ field, error }) => {
                        setError(field, { type: 'custom', message: error });
                    });
                },
            );
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
            <button disabled={!isDirty || !isValid || appStatus === 'pending'}>
                login
            </button>
        </form>
    );
};
